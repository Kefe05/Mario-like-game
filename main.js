const platform =  '../images/platform.png'
const background ='../images/background.png'
const hills = '../images/hills.png'
const platformSmallTall = '../images/platformSmallTall.png'
const spriteRunLeft ='../images/spriteRunLeft.png'
const spriteRunRight = '../images/spriteRunRight.png'
const spriteStandRight = '../images/spriteStandRight.png'
const spriteStandLeft = '../images/spriteStandLeft.png'


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

class Player{
  constructor(){
    this.position = {
      x : 100,
      y : 0
    }
    this.gravity = 0.5
    this.velocity ={
      x: 0,
      y: 2
    }
    this.width = 66;
    this.height = 150;
    this.image = createImage()
    this.frames = 0
    this.sprite =  {
      stand: {
        right: createImage(spriteStandRight),
        left : createImage(spriteStandLeft),
        cropWidth: 177,
        width : 66
      },
      run : {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth : 341,
        width: 127.875
      } 
    }
    this.currentSprite = this.sprite.stand.right
    this.currentCropWidth = this.sprite.stand.cropWidth
   }
  draw(){
    c.drawImage(
      
      this.currentSprite,
      this.currentCropWidth * this.frames, 
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      )
  }
  update(){
    this.frames ++
    if (this.frames > 59 && (this.currentSprite === this.sprite.stand.right || this.currentSprite === this.sprite.stand.left))
    { 
      this.frames = 0;
    } else if (this.frames > 29 && (this.currentSprite === this.sprite.run.right || this.currentSprite === this.sprite.run.left)){
      this.frames = 0;
    } 
    this.draw()
    player.position.x += player.velocity.x
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height){
    this.velocity.y += this.gravity;
  }
  

  }
}

class Platform{
  constructor({x, y}, image){
    this.position = {
      x,y
    },
    this.width = image.width,
    this.height = image.height,
    this.image = image
  }
  draw(){
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}
class GenericObject{
  constructor({x, y}, image){
    this.position = {
      x,y
    },
    this.width = image.width,
    this.height = image.height,
    this.image = image
  }
  draw(){
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}


function createImage(imgSrc){
  const img = new Image()
  img.src = imgSrc
  return img
}


let player = new Player
let platforms = []

let objects = []

let lastKey;
const keys = {
  right : {
    pressed : false
  }, 
  left : {
    pressed : false
  } 
}
let scrollOffSet = 0

function init(){
 player = new Player
 platforms = [
  new Platform({x: createImage(platform).width * 4 + 300 -2 + createImage(platform).width - createImage(platformSmallTall).width,y: 300}, createImage(platformSmallTall)),
  new Platform({x:-1, y:470}, createImage(platform)), 
  new Platform({x:(createImage(platform).width - 3), y: 470}, createImage(platform)),
  new Platform({x:((createImage(platform).width * 2) + 100), y: 470}, createImage(platform)),
  new Platform({x:(((createImage(platform).width * 3)) + 300), y: 470}, createImage(platform)),
  new Platform({x:(((createImage(platform).width * 4) - 2) + 300), y: 470}, createImage(platform)), 
  new Platform({x:(createImage(platform).width * 5 + 600), y: 470}, createImage(platform))
]

objects = [new GenericObject({x:0, y:0}, createImage(background)),
new GenericObject({x: 0, y:0}, createImage(hills))]  


 scrollOffSet = 0

}


function animate(){
  requestAnimationFrame(animate);

  c.fillStyle = "white"
  c.fillRect(0, 0, canvas.width,canvas.height)

  objects.forEach((object) => {
    object.draw()
  })

  platforms.forEach((platform) =>{
    platform.draw()
  })

  player.update();
 

  if (keys.right.pressed && player.position.x < 400){
    player.velocity.x = 5
    
  }
  else if ((keys.left.pressed && player.position.x > 1000)|| (keys.left.pressed && player.position.x > 0 && scrollOffSet === 0)){
    player.velocity.x = -5
  }
  else{
    player.velocity.x = 0

    if (keys.right.pressed){
      
      platforms.forEach((platform) =>{
        platform.position.x -= 5
        scrollOffSet += 5
      })
      objects.forEach((object) => {
        object.position.x -= 5
      })
    }
    else if (keys.left.pressed && scrollOffSet > 0){
     
      platforms.forEach((platform) =>{
        platform.position.x += 5
        scrollOffSet -= 5
      })
      objects.forEach((object) => {
        object.position.x += 5
      })
      
    } 
    if (
      keys.right.pressed &&
     lastKey === "right" &&
      player.currentSprite !== player.sprite.run.right
      ){
      player.frames = 1
      player.currentSprite = player.sprite.run.right;
      player.currentCropWidth = player.sprite.run.cropWidth;
      player.width= player.sprite.run.width;  
    }
    else if (
      keys.left.pressed &&
     lastKey === "left" &&
      player.currentSprite !== player.sprite.run.left){
      player.frames = 1
      player.currentSprite = player.sprite.run.left;
      player.currentCropWidth = player.sprite.run.cropWidth;
      player.width= player.sprite.run.width; 
    }
    else if (
      !keys.left.pressed &&
     lastKey === "left" &&
      player.currentSprite !== player.sprite.stand.left){
      player.frames = 1
      player.currentSprite = player.sprite.stand.left;
      player.currentCropWidth = player.sprite.stand.cropWidth;
      player.width= player.sprite.stand.width; 
    }
    else if (
      !keys.right.pressed &&
      lastKey === "right" &&
      player.currentSprite !== player.sprite.stand.right){
      player.frames = 1
      player.currentSprite = player.sprite.stand.right;
      player.currentCropWidth = player.sprite.stand.cropWidth;
      player.width= player.sprite.stand.width; 
    }
  }
    platforms.forEach((platform) =>{
    if (player.position.y  + player.height <= platform.position.y &&player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width){
      player.velocity.y = 0;
    }
    if (scrollOffSet >= 3000){
      console.log("you win")
    }

    if (player.position.y > canvas.height){
    init()
    }
})
}

console.log(scrollOffSet)
init()
animate()



window.addEventListener('keydown', ({keyCode}) =>{
  console.log(keyCode)
  switch(keyCode){
    case 38: 
      console.log("top");
      player.velocity.y -= 10; 
      break
    case 40:
      console.log("down")
      break
    case 39:
      keys.right.pressed = true;
     lastKey = 'right'   
      break
    case 37:
      keys.left.pressed = true;
     lastKey = "left"
       break 

  }
  
})

window.addEventListener('keyup', ({keyCode}) =>{
  switch(keyCode){
    case 38: 
      console.log("top");
      break
    case 40: 
      console.log("down")
      break
    case 39:
      keys.right.pressed = false;
      break
    case 37:
        keys.left.pressed = false;
       break 
  }
  
})