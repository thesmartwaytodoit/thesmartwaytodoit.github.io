import './src/css/style.css'
import jQuery from 'jquery'; 

window.$ = jQuery;

// window.$(function(){
  // var window.$readMoreLink = window.$(".read-more");

  // window.$readMoreLink.on("click", function(e){
  //   e.preventDefault();
  //   window.$(this).parent().next("div").show();
  //   window.$(this).remove();
  // });




  // Three JS Template
  //----------------------------------------------------------------- BASIC parameters
  var renderer = new THREE.WebGLRenderer({antialias:true});
  

  renderer.setSize( window.innerWidth, window.innerHeight );

  if (window.innerWidth > 800) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.needsUpdate = true;
    //renderer.toneMapping = THREE.ReinhardToneMapping;
    //console.log(window.innerWidth);
  };
  //---

  document.getElementById('threeJs').appendChild( renderer.domElement );

  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  };

  var camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 500 );

  camera.position.set(0, 2, 14);

  var scene = new THREE.Scene();
  var city = new THREE.Object3D();
  var smoke = new THREE.Object3D();
  var town = new THREE.Object3D();

  var createCarPos = true;
  var uSpeed = 0.001;

  //----------------------------------------------------------------- FOG background

  var setcolor = 0xfe5e57;
  //var setcolor = 0xF2F111;
  //var setcolor = 0xFF6347;

  scene.background = new THREE.Color(setcolor);
  scene.fog = new THREE.Fog(setcolor, 10, 16);
  //scene.fog = new THREE.FogExp2(setcolor, 0.05);
  //----------------------------------------------------------------- RANDOM Function
  function mathRandom(num = 8) {
    var numValue = - Math.random() * num + Math.random() * num;
    return numValue;
  };
  //----------------------------------------------------------------- CHANGE bluilding colors
  var setTintNum = true;
  function setTintColor() {
    if (setTintNum) {
      setTintNum = false;
      var setColor = 0x0A39F2;
    } else {
      setTintNum = true;
      var setColor = 0x0A39F2;
    };
    //setColor = 0x222222;
    return setColor;
  };

  //----------------------------------------------------------------- CREATE City

  function init() {
    var segments = 2;
    for (var i = 1; i<100; i++) {
      var geometry = new THREE.CubeGeometry(1,0,0,segments,segments,segments);
      var material = new THREE.MeshStandardMaterial({
        color:setTintColor(),
        wireframe:false,
        //opacity:0.9,
        //transparent:true,
        //roughness: 0.3,
        //metalness: 1,
        shading: THREE.SmoothShading,
        //shading:THREE.FlatShading,
        side:THREE.DoubleSide});
      var wmaterial = new THREE.MeshLambertMaterial({
        color:0xFFFFFF,
        wireframe:true,
        transparent:true,
        opacity: 0.03,
        side:THREE.DoubleSide/*,
        shading:THREE.FlatShading*/});

      var cube = new THREE.Mesh(geometry, material);
      var wire = new THREE.Mesh(geometry, wmaterial);
      var floor = new THREE.Mesh(geometry, material);
      var wfloor = new THREE.Mesh(geometry, wmaterial);
      
      cube.add(wfloor);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.rotationValue = 0.1+Math.abs(mathRandom(8));
      
      //floor.scale.x = floor.scale.z = 1+mathRandom(0.33);
      floor.scale.y = 0.05;//+mathRandom(0.5);
      cube.scale.y = 0.1+Math.abs(mathRandom(8));
      //TweenMax.to(cube.scale, 1, {y:cube.rotationValue, repeat:-1, yoyo:true, delay:i*0.005, ease:Power1.easeInOut});
      /*cube.setScale = 0.1+Math.abs(mathRandom());
      
      TweenMax.to(cube.scale, 4, {y:cube.setScale, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});
      TweenMax.to(cube.position, 4, {y:cube.setScale / 2, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});*/
      
      var cubeWidth = 0.9;
      cube.scale.x = cube.scale.z = cubeWidth+mathRandom(1-cubeWidth);
      //cube.position.y = cube.scale.y / 2;
      cube.position.x = Math.round(mathRandom());
      cube.position.z = Math.round(mathRandom());
      
      floor.position.set(cube.position.x, 0/*floor.scale.y / 2*/, cube.position.z)
      
      town.add(floor);
      town.add(cube);
    };
    //----------------------------------------------------------------- Particular
    
    var gmaterial = new THREE.MeshToonMaterial({color:0xFFFF00, side:THREE.DoubleSide});
    var gparticular = new THREE.CircleGeometry(0.01, 3);
    var aparticular = 5;
    
    for (var h = 1; h<300; h++) {
      var particular = new THREE.Mesh(gparticular, gmaterial);
      particular.position.set(mathRandom(aparticular), mathRandom(aparticular),mathRandom(aparticular));
      particular.rotation.set(mathRandom(),mathRandom(),mathRandom());
      smoke.add(particular);
    };
    
    var pmaterial = new THREE.MeshPhongMaterial({
      color:0x001052,
      side:THREE.DoubleSide,
      roughness: 10,
      metalness: 0.6,
      opacity:0.9,
      transparent:true});
    var pgeometry = new THREE.PlaneGeometry(60,60);
    var pelement = new THREE.Mesh(pgeometry, pmaterial);
    pelement.rotation.x = -90 * Math.PI / 180;
    pelement.position.y = -0.001;
    pelement.receiveShadow = true;
    //pelement.material.emissive.setHex(0xFFFFFF + Math.random() * 100000);

      // console.log(pelement)

    // city.add(pelement);
  };

  //----------------------------------------------------------------- MOUSE function
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2(), INTERSECTED;
  var intersected;

  function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  function onDocumentTouchStart( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouse.x = event.touches[ 0 ].pageX -  window.innerWidth / 2;
      mouse.y = event.touches[ 0 ].pageY - window.innerHeight / 2;
    };
  };
  function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouse.x = event.touches[ 0 ].pageX -  window.innerWidth / 2;
      mouse.y = event.touches[ 0 ].pageY - window.innerHeight / 2;
    }
  }
  window.addEventListener('mousemove', onMouseMove, false);
  // window.addEventListener('touchstart', onDocumentTouchStart, false );
  // window.addEventListener('touchmove', onDocumentTouchMove, false );

  //----------------------------------------------------------------- Lights
  var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
  var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
  var lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

  var spotLightHelper = new THREE.SpotLightHelper( lightFront );
  //scene.add( spotLightHelper );

  lightFront.rotation.x = 45 * Math.PI / 180;
  lightFront.rotation.z = -45 * Math.PI / 180;
  lightFront.position.set(5, 5, 5);
  lightFront.castShadow = true;
  lightFront.shadow.mapSize.width = 6000;
  lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
  lightFront.penumbra = 0.1;
  lightBack.position.set(0,6,0);

  smoke.position.y = 2;

  scene.add(ambientLight);
  city.add(lightFront);
  scene.add(lightBack);
  scene.add(city);
  city.add(smoke);
  city.add(town);

  //----------------------------------------------------------------- GRID Helper
  var gridHelper = new THREE.GridHelper( 60, 120, 0xFE5E57, 0x0A39F2);
  city.add( gridHelper );

  //----------------------------------------------------------------- CAR world
  var generateCar = function() {
    
  }
  //----------------------------------------------------------------- LINES world

  var createCars = function(cScale = 2, cPos = 20, cColor = 0xFFFF00) {
    var cMat = new THREE.MeshToonMaterial({color:cColor, side:THREE.DoubleSide});
    var cGeo = new THREE.CubeGeometry(1, cScale/40, cScale/40);
    var cElem = new THREE.Mesh(cGeo, cMat);
    var cAmp = 3;
    
    if (createCarPos) {
      createCarPos = false;
      cElem.position.x = -cPos;
      cElem.position.z = (mathRandom(cAmp));

      TweenMax.to(cElem.position, 3, {x:cPos, repeat:-1, yoyo:true, delay:mathRandom(3)});
    } else {
      createCarPos = true;
      cElem.position.x = (mathRandom(cAmp));
      cElem.position.z = -cPos;
      cElem.rotation.y = 90 * Math.PI / 180;
    
      TweenMax.to(cElem.position, 5, {z:cPos, repeat:-1, yoyo:true, delay:mathRandom(3), ease:Power1.easeInOut});
    };
    cElem.receiveShadow = true;
    cElem.castShadow = true;
    cElem.position.y = Math.abs(mathRandom(5));
    city.add(cElem);
  };

  var generateLines = function() {
    for (var i = 0; i<60; i++) {
      createCars(0.1, 20);
    };
  };

  //----------------------------------------------------------------- CAMERA position

  var cameraSet = function() {
    createCars(0.1, 20, 0xFFcc11);
    //TweenMax.to(camera.position, 1, {y:1+Math.random()*4, ease:Expo.easeInOut})
  };

  //----------------------------------------------------------------- ANIMATE

  var animate = function() {
    var time = Date.now() * 0.00005;
    requestAnimationFrame(animate);
    
    city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
    city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
    if (city.rotation.x < -0.05) city.rotation.x = -0.05;
    else if (city.rotation.x>1) city.rotation.x = 1;
    var cityRotation = Math.sin(Date.now() / 5000) * 13;
    //city.rotation.x = cityRotation * Math.PI / 180;
    
    //console.log(city.rotation.x);
    // camera.position.y -= (-(mouse.y * 20) - camera.rotation.y) * uSpeed;;
    
    for ( let i = 0, l = town.children.length; i < l; i ++ ) {
      var object = town.children[ i ];
      //object.scale.y = Math.sin(time*50) * object.rotationValue;
      //object.rotation.y = (Math.sin((time/object.rotationValue) * Math.PI / 180) * 180);
      //object.rotation.z = (Math.cos((time/object.rotationValue) * Math.PI / 180) * 180);
    }
    
    smoke.rotation.y += 0.01;
    smoke.rotation.x += 0.01;

    // console.log(city.position)
    
    camera.lookAt(city.position);
    renderer.render( scene, camera );  
  }

  //----------------------------------------------------------------- START functions
  generateLines();
  init();
  animate();






  function write(obj, sentence, i, cb) {
    if (i != sentence.length) {
      setTimeout(function () {
        i++
        obj.innerHTML = sentence.substr(0, i + 1) +' <em aria-hidden="true"></em>';
        write(obj, sentence, i, cb)
      }, 50)
    } else {
      cb()
    }
  }
  
  function erase(obj, cb, i) {
    var sentence = obj.innerText;
    if (sentence.length != 0) {
      setTimeout(function() {
        sentence = sentence.substr(0, sentence.length-1)
        obj.innerText = sentence;
        erase(obj, cb);
      }, 30 / (i * (i / 10000000)))
    } else {
      obj.innerText = " "
      cb()
    }
  }
  
  var typeline = document.querySelector("#typeline");
  
  function writeErase(obj, sentence, time, cb) {
    write(obj, sentence, 0, function() {
      setTimeout(function() {
        erase(obj, cb) }, time) })
  }
  var sentences = [
    "Genius. ",
    "Brilliant. ",
    "Smart. "
  ]
  var counter = 0;
  
  function loop() {
    var sentence = sentences[counter % sentences.length]
    writeErase(typeline, sentence, 3500, loop)
    counter++
  }
  
  loop();



  // ------------------------------------------------------> COUNTER
  var a = 0;
  window.$(window).scroll(function() {
  
    var oTop = window.$('#counter').offset().top - window.innerHeight;
    if (a == 0 && window.$(window).scrollTop() > oTop) {
      $('.counter-value').each(function() {
        var $this = window.$(this),
          countTo = $this.attr('data-count');
        $({
          countNum: $this.text()
        }).animate({
            countNum: countTo
          },
  
          {
  
            duration: 2000,
            easing: 'swing',
            step: function() {
              $this.text(Math.floor(this.countNum));
            },
            complete: function() {
              $this.text(this.countNum);
              //alert('finished');
            }
  
          });
      });
      a = 1;
    }
  
  });

  // ------------------------------------------------------> LOADER

  setTimeout(function(){
    $('.loader-screen').fadeOut();
  },600)






  
