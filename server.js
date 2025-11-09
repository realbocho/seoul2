const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Favicon 처리
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// 데이터베이스 초기화
// Vercel은 읽기 전용 파일 시스템이므로 /tmp 디렉토리 사용
const dbPath = process.env.VERCEL 
    ? path.join('/tmp', 'recommendations.db')
    : path.join(__dirname, 'recommendations.db');

// 데이터베이스 파일이 없으면 생성
if (process.env.VERCEL && !fs.existsSync('/tmp')) {
    fs.mkdirSync('/tmp', { recursive: true });
}

let db;
try {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('데이터베이스 연결 오류:', err.message);
        } else {
            console.log('데이터베이스에 연결되었습니다:', dbPath);
            initDatabase();
        }
    });
} catch (error) {
    console.error('데이터베이스 초기화 오류:', error);
}

// 데이터베이스 테이블 생성
function initDatabase() {
    if (!db) {
        console.error('데이터베이스가 초기화되지 않았습니다.');
        return;
    }
    
    db.run(`
        CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            place_name TEXT NOT NULL,
            address TEXT,
            x REAL NOT NULL,
            y REAL NOT NULL,
            reason TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('테이블 생성 오류:', err.message);
        } else {
            console.log('데이터베이스 테이블이 준비되었습니다.');
        }
    });
}

// 데이터베이스 연결 확인 및 재시도
function ensureDatabase() {
    if (!db) {
        try {
            db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('데이터베이스 재연결 오류:', err.message);
                } else {
                    console.log('데이터베이스에 재연결되었습니다.');
                    initDatabase();
                }
            });
        } catch (error) {
            console.error('데이터베이스 초기화 오류:', error);
        }
    }
}

// 모든 추천 장소 가져오기
app.get('/api/recommendations', (req, res) => {
    ensureDatabase();
    if (!db) {
        return res.status(500).json({ error: '데이터베이스 연결 실패' });
    }
    
    db.all(`
        SELECT 
            place_name,
            address,
            x,
            y,
            GROUP_CONCAT(reason, '|||') as reasons
        FROM recommendations
        GROUP BY place_name, address, x, y
    `, (err, rows) => {
        if (err) {
            console.error('추천 데이터 조회 오류:', err.message);
            res.status(500).json({ error: '데이터 조회 실패' });
        } else {
            const recommendations = {};
            rows.forEach(row => {
                const reasons = row.reasons ? row.reasons.split('|||') : [];
                recommendations[row.place_name] = {
                    placeName: row.place_name,
                    address: row.address || '',
                    x: row.x,
                    y: row.y,
                    reasons: reasons
                };
            });
            res.json(recommendations);
        }
    });
});

// 추천 추가
app.post('/api/recommendations', (req, res) => {
    ensureDatabase();
    if (!db) {
        return res.status(500).json({ error: '데이터베이스 연결 실패' });
    }
    
    const { placeName, address, x, y, reason } = req.body;

    if (!placeName || !reason || !x || !y) {
        return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }

    db.run(`
        INSERT INTO recommendations (place_name, address, x, y, reason)
        VALUES (?, ?, ?, ?, ?)
    `, [placeName, address || '', x, y, reason], function(err) {
        if (err) {
            console.error('추천 추가 오류:', err.message);
            res.status(500).json({ error: '추천 추가 실패' });
        } else {
            res.json({ 
                success: true, 
                message: '추천이 등록되었습니다.',
                id: this.lastID 
            });
        }
    });
});

// Vercel 서버리스 함수로 export
module.exports = app;

// 로컬 개발 환경에서만 서버 시작
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('데이터베이스 닫기 오류:', err.message);
                } else {
                    console.log('데이터베이스 연결이 닫혔습니다.');
                }
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
}

