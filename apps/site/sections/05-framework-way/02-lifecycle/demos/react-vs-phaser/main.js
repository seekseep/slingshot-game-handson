// 左は Phaser、右は React。どちらも「用意しておくと、向こうから呼ばれる」形は同じ。
// 違うのは、何をきっかけに呼ばれるか。Phaser は時間、React は状態。

// --- Phaser 側：update が毎フレーム呼ばれる ------------------------------
class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.frames = 0;
    this.label = this.add
      .text(150, 30, '', { fontSize: '15px', color: '#333333' })
      .setOrigin(0.5);
    this.ball = this.add
      .circle(40, 96, 14, 0xffffff)
      .setStrokeStyle(3, 0x333333);
    this.speed = 2.5;
  }

  update() {
    this.frames += 1;
    this.ball.x += this.speed;
    if (this.ball.x > 260 || this.ball.x < 40) this.speed *= -1;
    this.label.setText('update が呼ばれた回数 ' + this.frames);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 300,
  height: 160,
  backgroundColor: '#fdf6e3',
  scene: [MainScene],
});

// --- React 側：状態が変わったときだけ関数が呼び直される -------------------
const { useState, useEffect } = React;

// この関数を呼ぶ行は、どこにも書かない。呼ぶのは React。
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 最初の 1 回だけ。Phaser の create にあたる。
    console.log('useEffect: 最初の 1 回');
    return () => console.log('片付け: 去るときに呼ばれる');
  }, []);

  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 10 }}>
      <p className="count">{count}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        ボタンを押すと 1 増える
      </button>
      <p className="note">
        押すまで、この関数は呼び直されません。
        <br />
        左の数字は、その間もずっと増え続けています。
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.querySelector('#react-root')).render(<Counter />);
