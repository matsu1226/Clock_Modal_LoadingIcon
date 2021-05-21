'use strict'
{
    const modalNum = 3;     //modalの個数

    function modalPlay(open, close, mask, modal) {
        open.addEventListener('click', () => {
            modal.classList.remove('hidden');
            mask.classList.remove('hidden');
        })
        close.addEventListener('click', () => {
            modal.classList.add('hidden');
            mask.classList.add('hidden');
        })
        mask.addEventListener('click', () => {
            close.click();
        })
    }

    // modalPlay(open0, close0, mask0, modal0);
    // modalPlay(open1, close1, mask1, modal1);
    // modalPlay(open2, close2, mask2, modal2);

    function start(){
        for (let i = 0; i < modalNum; i++) {
            const open = document.getElementById('open'+i);
            const close = document.getElementById('close'+i);
            const mask = document.getElementById('mask'+i);
            const modal = document.getElementById('modal'+i);

            modalPlay(open, close, mask, modal);
            console.log(open);
        }
    }

    start();
    
}