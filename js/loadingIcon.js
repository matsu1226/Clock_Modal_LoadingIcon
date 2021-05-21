'use strict'
{
    class IconDrawer {
        constructor(canvas) {
            this.ctx = canvas.getContext('2d');
            this.width = canvas.width;
            this.height = canvas.height;
            this.r = 60;                //半径
            this.opacityRate = 0.2;     //フレーム毎に重ねる白色の濃さ
        }

        // clear() {
        //     this.ctx.clearRect(0, 0, this.width, this.height);
        // }

        draw(angle) {
            //draw()は何度も実行されるので、描画された点がcanvas上に残る…
            //描画毎に、半透明の白を塗り重ねて、数フレームの時間をかけて少しずつ点を消したい。
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacityRate})`;
            this.ctx.fillRect(0, 0, canvas.width, canvas.height);


            this.ctx.save();        //canvasの座標系,style等を保存（https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D/save）
            this.ctx.translate(this.width / 2, this.height / 2);  //canvasの原点をcanvasの左上から中心へ移動
            this.ctx.rotate(Math.PI / 180 * angle);          //this.angle度ずつ回転

            // this.ctx.beginPath();
            // this.ctx.arc(0, 0, this.r, 0, 2 * Math.PI);    //canvasの中心に半径rの円
            // this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, - this.r - 1);  //円の上端より5px上に移動
            this.ctx.lineTo(0, - this.r + 1);  //10px分下方に線を引く
            this.ctx.strokeStyle = 'gray';     //線の色をオレンジに
            this.ctx.lineWidth = 12;           //線の太さを6pxに
            this.ctx.lineCap = 'round'         //線の角を丸める
            this.ctx.stroke();                 //描画

            this.ctx.restore();
        }
    }


    class Icon {
        constructor(drawer) {   //IconクラスはIconDrawerインスタンスが渡されるので、IconクラスのconstructorにもIconDrawerインスタンスが渡される。
            this.drawer = drawer;
            this.angle = 0;             //開始時の角度
            this.angleRate = 10;         //毎フレームに何度回転させるか
            this.frameRate = 10;        //何ms毎に描画するか
            this.frameCount = 0;
        }

        draw() {
            this.drawer.draw(this.angle);
        }
        update() {
            this.angle += this.angleRate;   //this.angleを12度加算
        }

        run() {
            this.update();      //this.angleを12度加算
            this.draw();        //図形の描画

            this.timeoutId = setTimeout(() => {    //このメソッド自体を100ms毎に実行
                // if (this.frameCount === 10) {
                    // clearTimeout(this.timeoutId)
                    // this.drawer.clear();
                // }
                this.run();
                this.frameCount++;
            }, this.frameRate);
        }
    }


    const canvas = document.querySelector('canvas');
    (() => {
        if (typeof canvas.getContext === 'undefined') {       //canvas.getContext()が値を持たなかったら
            return;                                         //returnは関数内でしか使えないので、if文を即時関数で囲う。
        }
    });

    const icon = new Icon(new IconDrawer(canvas));
    const bodyWrapper = document.getElementById('bodyWrapper');

    icon.run();

    setTimeout(()=>{
        clearTimeout(icon.timeoutId);
        icon.drawer.ctx.clearRect(0, 0, icon.drawer.width, icon.drawer.height);
    },3000)
    
    setTimeout(()=>{
        bodyWrapper.style.display = 'block';
    },3500);

}