'use strict';

function clockStart() {

    //clock描画の基本設定をまとめたClockDrawerクラス
    class ClockDrawer {
        constructor(canvas) {
            this.ctx = canvas.getContext('2d');
            this.width = canvas.width;
            this.height = canvas.height;

        }

        //盤面・針の描画のための基本設定
        draw(angle, func) {
            this.ctx.save();                        //現在の座標系やstyleを保存

            this.ctx.translate(this.width / 2, this.height / 2);   //座標中心を左上から中心へ
            this.ctx.rotate(Math.PI / 180 * angle);  //6度ずつ、座標系を回転
            this.ctx.beginPath();                    //Pathの開始

            func(this.ctx);         //他メソッドで記述された描画内容を実行

            this.ctx.stroke();                       //Pathの実行

            this.ctx.restore();                      //saveした座標系やstyleに戻す
        }

        //描画を毎フレームリセット
        clear() {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }

    }



    class Clock {
        constructor(drawer) {       //引数drawerにはClockDrawerインスタンスが渡される予定
            this.drawer = drawer;
            this.r = 100;
        }

        //盤面を描画するメソッド
        drawFace() {
            //目盛りの描画
            for (let angle = 0; angle < 360; angle += 6) {

                this.drawer.draw(angle, ctx => {          //L12あたりを参照。draw(angle,func){}である。
                    ctx.moveTo(0, -this.r);             //半径分、真上に移動

                    //太い線を描画するための条件分岐
                    if (angle % 30 === 0) {               //角度が30度の倍数なら、
                        ctx.lineWidth = 2;              //線を太く
                        ctx.lineTo(0, -this.r + 10);    //線を10pxの長さに
                        ctx.font = '13px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillStyle = '#000';
                        ctx.fillText(angle / 30 || 12, 0, -this.r + 25);    //※１、ctX.fillText(text, x, y [, maxWidth ])

                    } else {                              //角度が30度の倍数以外なら、
                        ctx.lineTo(0, -this.r + 5);     //線を5pxの長さに
                    }

                });
            }
        }

        drawHands() {
            //hour(短針)の描画
            //角度は「時間数*30度 + 分数* 30度/60分」
            this.drawer.draw(this.h * 30 + this.m * 0.5, ctx => {        //L12あたり。draw(angle,func){}
                ctx.lineWidth = 6;      //線は太く
                ctx.moveTo(0, 10);      //中心から10pxだけ下に移動
                ctx.lineTo(0, -this.r + 50);        //半径より50px短い長さだけ線を設定
            })
            //minutes(長針)の描画
            //角度は「分数* 360度/60分」
            this.drawer.draw(this.m * 6, ctx => {        //L12あたり。draw(angle,func){}
                ctx.lineWidth = 4;
                ctx.moveTo(0, 10);      //中心から10pxだけ下に移動
                ctx.lineTo(0, -this.r + 30);        //半径より30px短い長さだけ線を設定
            })
            //seconds(秒針)の描画
            //角度は「秒数* 360度/60分」
            this.drawer.draw(this.s * 6, ctx => {        //L12あたり。draw(angle,func){}
                ctx.strokeStyle = 'red';
                ctx.moveTo(0, 20);      //中心から20pxだけ下に移動
                ctx.lineTo(0, -this.r + 20);        //半径より30px短い長さだけ線を設定
            })
        }

        //現在時刻の更新
        update() {
            const d = new Date();
            this.h = d.getHours();
            this.m = d.getMinutes();
            this.s = d.getSeconds();
        }

        run() {
            this.update();      //現在時刻の更新
            this.drawer.clear();//前回の描画を消す　<= 「drawer(Clockクラスのconstructorの引数)にあるclearメソッド = ClockDrawerクラスにあるclearメソッド」
            this.drawFace();    //時計の盤面の描画
            this.drawHands();   //時計の針の描画（hand=>時計の針）

            setTimeout(() => {    //関数を回帰的に実行
                this.run()
            }, 100);
        }
    }


    const canvas = document.querySelector('canvas');
    if (canvas.getContext === 'undefined') {    //canvasが読み込めないなら処理をしない
        return;         //この値が返る場所を作るため、main.js全体を即時関数で囲っている
    }


    //Clockインスタンスの生成
    const clock = new Clock(new ClockDrawer(canvas));
    //clockインスタンスを動作
    console.log(clock);
    clock.run();
};


setTimeout(()=>{
    clockStart();
},3500);


//※１   「 || 」の特殊用法 
//( A || B ) => A='true'であればAを返す。そうでない場合はBを返す。

//( angle/30 || 12 ) 
// => angle/30が'true（値をもつ）'ならangle/30を返す。
//    angle/30が'false（値をもたない (0の値を持つ場合を含む)）'なら12を返す。