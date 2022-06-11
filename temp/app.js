  // 기본 모듈
  var express = require('express')
    , path    = require('path')
    , http    = require('http');

  // express 미들웨어
  var bodyParser    = require('body-parser')
    , cookieParser  = require('cookie-parser')
    , static        = require('serve-static')
    , errorHandler  = require('errorhandler');

  // 에러 핸들러 모듈 사용
  var expressErrorHandler   = require('express-error-handler');

  // Session 미들웨어
  var expressSession        = require('express-session');
  // 크로스 도메인 처리 미들웨어
  var cors                  = require('cors')();
  // 로거 미들웨어
  var logger                = require('morgan');

  var {MiddleWare_Auth}     = require('./middleware/auth')

  var path                  = require('path');
  var fs                    = require('fs');
  var rfs                   = require('rotating-file-stream') // version 2.x

  //===== Passport 사용 =====//
  var passport              = require('passport');
  var flash                 = require('connect-flash');

  // 설정 파일 불러오기
  var routerConf            = require('./config/router');
  var {LOGCONF}             = require('./config/log');

  // 라우팅 로더
  var route_loader          = require('./routes/route_loader');



  // log
  const accessLogRotation = (time, index) => {
    if (!time) return LOGCONF.name;
    for( var i=LOGCONF.rotation; i>0; i-- ){
      let logFile = LOGCONF.path + '/' + LOGCONF.name + '.' + i;
      if (fs.existsSync( logFile )) { 
        if( i == LOGCONF.rotation ) {
          fs.unlinkSync( logFile );
        } else {
          let newFile = LOGCONF.path + '/' + LOGCONF.name + '.' + (i+1);
          fs.renameSync(logFile, newFile)
        }
      } else {
      }
    }
    return  LOGCONF.name + '.1';
  };

  var accessLogStream = rfs.createStream( accessLogRotation, {
    interval: LOGCONF.interval,
    path: LOGCONF.path
  })
  
  // 익스프레스 객체 생성
  var app = express();

  //===== ng View 설정 =====//
  //app.use(express.static(path.join(__dirname, 'views')));

  //===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
  console.log('routerConf.server_port : %d', routerConf.server_port);
  app.set('port',  routerConf.server_port);

  // body-parser를 이용해 application/x-www-form-urlencoded 파싱
  app.use(bodyParser.urlencoded({ extended: false }))

  // body-parser를 이용해 application/json 파싱
  app.use(bodyParser.json())

  // public 폴더를 static으로 오픈
  app.use('/public', static(path.join(__dirname, 'public')));

  // cookie-parser 설정
  app.use(cookieParser());

  // 세션 설정
  app.use(expressSession({
    secret:'!sjskwkfgktpdy@2021', // 비밀키
    resave : false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1 // 세션 유효기간 1 day
    }
  }));

  // SET log
  app.use(logger( LOGCONF.format, { stream: accessLogStream } ));

  //===== Passport 사용 설정 =====//
  // Passport의 세션을 사용할 때는 그 전에 Express의 세션을 사용하는 코드가 있어야 함
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(cors);

  //===== Middle Ware 사용 설정 =====//
  app.use( MiddleWare_Auth )

  //라우팅 정보를 읽어 들여 라우팅 설정
  var router = express.Router();
  route_loader.init(app, router);

  //===== 404 에러 페이지 처리 =====//
  var errorHandler = function (err, req, res, next) {
    res.status(404).send('');
  }

  app.use( expressErrorHandler.httpError(404) );
  app.use( errorHandler );

  //===== 서버 시작 =====//
  //확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함morgan
  process.on('uncaughtException', function (err) {
  	console.log('uncaughtException 발생함 : ' + err);
  	console.log('서버 프로세스 종료하지 않고 유지함.');
  	console.log(err.stack);
  });

  // 프로세스 종료 시에 데이터베이스 연결 해제
  process.on('SIGTERM', function () {
      console.log("프로세스가 종료됩니다.");
      app.close();
  });

  app.on('close', function () {
  	console.log("Express 서버 객체가 종료됩니다.");
  });

  // 시작된 서버 객체를 리턴받도록 합니다.
  var server = http.createServer(app).listen(app.get('port'), function(){
  	console.log('Server startms');
  });
