kaboom({
  fullscreen: true,
  clearColor: [0, 0.5, 1, 1], // rgba
  global: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("ground", "block.png");
loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("peach", "princes.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("surprise", "surprise.png");
loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSprite("evil mushroom", "evil_mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("dino", "dino.png");
loadSprite("star", "star.png");

let score = 0;

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                           s                                                                       s            =",
    "                       s                                                                          s                                             =",
    "                                                                                                                                                =",
    "                                                                                                                                                =",
    "           s                                 s                                      s                                 s                         =",
    "                                                                                                                                                =",
    "                                                                                                                                                =",
    "                                                                                     ==============                                             =",
    "                                                         e         ============                            e                                    =",
    "                                                     ==========                                         ==============                          =",
    "                                       ==========                                          !                                                    =",
    "         ?                   ========                                        !                                u         ?                       =",
    "                =========                                                                          ?                                p           =",
    "            e                           a                                                                                                       =",
    "=================================================================================================================================================",
  ];

  const mapSymbol = {
    width: 20,
    height: 20,
    "=": [sprite("ground"), solid()],
    $: [sprite("coin"), "coin"],
    "?": [sprite("surprise"), solid(), "coin_surprise"],
    "!": [sprite("surprise"), solid(), "mushroom_surprise"],
    v: [sprite("unboxed"), solid()],
    m: [sprite("mushroom"), solid(), "mushroom", body()],
    p: [sprite("pipe"), solid(), "pipe"],
    d: [sprite("dino"), solid()],
    s: [sprite("star"), solid()],
    e: [sprite("evil mushroom"), solid(), "evil mushroom", body()],
    a: [sprite("evil mushroom"), solid(), "evil mushroom", body()],
    u: [sprite("evil mushroom"), solid(), "evil mushroom", body()],
  };

  const gameLevel = addLevel(map, mapSymbol);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([text("score" + score)]);

  keyDown("right", () => {
    player.move(150, 0);
  });

  keyDown("left", () => {
    player.move(-150, 0);
  });

  keyDown("space", () => {
    if (player.grounded()) {
      play("jump");
      play("gameSound");
      player.jump(400);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin_surprise")) {
      destroy(obj);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      gameLevel.spawn("v", obj.gridPos.sub(0, 0));
    }

    if (obj.is("mushroom_surprise")) {
      destroy(obj);
      gameLevel.spawn("v", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });

  action("mushroom", (obj) => {
    obj.move(30, 0);
  });

  action("evil mushroom", (obj) => {
    obj.move(30, 0);
  });

  player.collides("coin", (obj) => {
    score += 5;
    destroy(obj);
  });

  player.collides("mushroom", (obj) => {
    destroy(obj);
    // we add this
    player.biggify(5);
  });

  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("win");
    });
  });

  // add this
  const FALL_DOWN = 500;

  player.action(() => {
    camPos(player.pos);
    // add this
    if (player.pos.y >= FALL_DOWN) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score: " + score;
  });

  let isJumping = false;

  player.collides("evil mushroom", (obj) => {
    if (isJumping) {
      destroy(obj);
    } else {
      go("lose");
      destroy(player);
    }
  });

  player.action(() => {
    isJumping = !player.grounded();
  });

  // scene end
});

scene("lose", () => {
  add([
    text("Game Over\nTry again", 45),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyDown("space", () => {
    go("game");
  });
});

scene("win", () => {
  add([
    text("You Won\nGood job", 45),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    go("game");
  });
  //end win scene
});

start("game");
