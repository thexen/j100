[typescript 설치]

npm i -g typescript, ts-node, @types/node   

[ts 파일 빌드 준비]
tsc --init
 > tsconfig.json 생성 됨

tsconfig.json를 열어 설정 파일 적당히 수정
 outDir : 컴파일 경로 지정

[ts 파일 빌드]
cd ts
tsc -p wallets.ts 
 > build/wallets.js 생성됨
 > copy build/wallets.j ../.

wallets.js 을 import(require) 하여 사용

[test]
node test/test.js
