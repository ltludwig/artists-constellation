let artistas = [];
let randomicos = [];
let ang = 2;
let botao = 0;
let easing = 0.05;
let counter = 0;
let map_ini = 1450;
let map_fim = 2020;
let total = false;
let slider1;
let slider2;
let searchInput;
let genderFilter;
let birthCheckbox, deathCheckbox;
let c;

function preload() {
  table = loadTable("pessoas.csv", "csv", "header");
}

function setup() {
  c = createCanvas(800, 800);
  ellipse(0, 0, 600, 600);
  textAlign(CENTER);
  frameRate(60);
  background(20, 35, 50);
  myFont = loadFont("Barlow-Regular.ttf");
  textSize(14);
  textFont(myFont);

  let sliderLabel = createElement('label', 'Arraste para selecionar o intervalo a ser filtrado:');
  sliderLabel.position(20, height / 2 - 40);
  sliderLabel.style('color', '#FFF');
  slider1 = createSlider(1400, 1630);
  slider1.position(20, height / 2);
  slider1.input(() => {
    let sliderValue = select('#slider-value');
    if (!sliderValue) {
      sliderValue = createSpan(slider1.value()).id('slider-value');
      sliderValue.position(330, height / 2 - 10);
      sliderValue.style('color', '#FFF');
    } else {
      sliderValue.html(slider1.value());
    }
  });
  let minLabel = createElement('span', '1400');
  minLabel.position(20, height / 2 + 20);
  minLabel.style('color', '#FFF');
  let maxLabel = createElement('span', '1630');
  maxLabel.position(320, height / 2 + 20);
  maxLabel.style('color', '#FFF');
  slider1.style('width', '300px');
  slider1.style('background', '#2f2f2f');
  slider1.style('border-radius', '12px');
  slider1.style('height', '2px');
  slider1.style('outline', 'none');

  let searchLabel = createElement('label', 'Buscar artista pelo nome:');
  searchLabel.position(20, height / 2 + 70);
  searchLabel.style('color', '#FFF');
  searchInput = createInput("");
  searchInput.position(20, height / 2 + 100);
  searchInput.size(300);
  searchInput.attribute("placeholder", "Buscar artista pelo nome");
  searchInput.input(() => botao = 0); // Reset button to ensure remapping after search

  // Cria checkboxes para os filtros de nascimento e morte
  birthCheckbox = createCheckbox(' ', true);
birthCheckbox.class('checkbox-wrapper-17');
birthCheckbox.id('switch-17');
birthCheckbox.position(20, height / 2 + 180);
  birthCheckbox.changed(() => botao = 0); // Reset button to ensure remapping after filter change

deathCheckbox = createCheckbox(' ', true);
deathCheckbox.class('checkbox-wrapper-17');
deathCheckbox.id('switch-17');
deathCheckbox.position(180, height / 2 + 180);

  // Adiciona legenda para os checkboxes
  let checkboxLegend = createElement('span', 'Nascimentos');
  checkboxLegend.position(20, height / 2 + 270);
  checkboxLegend.style('color', '#FFF');

  let checkboxLegend2 = createElement('span', 'Mortes');
  checkboxLegend2.position(180, height / 2 + 270);
  checkboxLegend2.style('color', '#FFF');
  deathCheckbox.changed(() => botao = 0); // Reset button to ensure remapping after filter change

  // Adiciona os dados dos artistas, substituindo 'NULL' por ''
  for (let i = 0; i < table.getRowCount(); i++) {
    let nome = table.getString(i, 1) === 'NULL' ? '' : table.getString(i, 1);
    let genero = table.getString(i, 2) === 'NULL' ? '' : table.getString(i, 2);
    let data_nasc = table.getString(i, 5) === 'NULL' ? '' : table.getString(i, 5);
    let data_morte = table.getString(i, 8) === 'NULL' ? '' : table.getString(i, 8);

    randomicos.push(random(150, 400));
    artistas.push(
      new Artista(
        nome,
        genero,
        data_nasc,
        data_morte,
        randomicos[i],
      )
    );
  }
}

function draw() {
  background(20, 35, 50);
  noFill();
  ellipse(width / 2, height / 2, 800, 800);
  fill(255);
  noStroke();
  drawYearScale();
  drawAll();

  map_ini = slider1.value();
}

function keyPressed() {
  botao++;
}

function drawAll() {
  counter = 0;
  let searchTerm = searchInput.value().toLowerCase();

  for (let i = 0; i < artistas.length; i++) {
    if (botao == 0) {
      artistas[i].init();
    } else {
      artistas[i].update();
    }
  }

  stroke(255);
  fill(255, 255, 255, 50);

  for (let i = 0; i < artistas.length; i++) {
    if ((searchTerm === "" || artistas[i].nome.toLowerCase().includes(searchTerm))) {
      artistas[i].highlight();
    }
  }

  if (counter == 0) {
    for (let i = 0; i < artistas.length; i++) {
      if ((searchTerm === "" || artistas[i].nome.toLowerCase().includes(searchTerm))) {
        artistas[i].display();
      }
    }
  } else {
    for (let i = 0; i < artistas.length; i++) {
      if ((searchTerm === "" || artistas[i].nome.toLowerCase().includes(searchTerm))) {
        artistas[i].display_hide();
      }
    }
  }
}

function drawYearScale() {
  let intervalo = map_fim - map_ini;
  fill(255, 255);
  textSize(13);

  text("2020", 380, 290);
  text(str(map_ini), 420, 290);

  for (let i = map_ini; i <= map_fim; i += intervalo / 7) {
    let angulo = map(i, map_ini, map_fim, 0, 360);
    let x = 400 + 120 * cos(radians(angulo - 90));
    let y = 400 + 120 * sin(radians(angulo - 90));
    let x_outer = 400 + 500 * cos(radians(angulo - 90));
    let y_outer = 400 + 500 * sin(radians(angulo - 90));

    if (i != map_ini && i != map_fim && i < map_fim - 10) {
      textAlign(CENTER);
      stroke(255, 40);
      line(x, y, x_outer, y_outer);
      noStroke();
      text(int(i), x, y);
    }
  }
}

class Artista {
  constructor(nome, genero, data_nasc, data_morte, r) {
    this.nome = nome;
    this.genero = genero;
    this.data_nasc = data_nasc;
    this.data_morte = data_morte;
    this.r = r;
    this.ativo = false;
  }

  display() {
    if (this.data_nasc > map_ini && birthCheckbox.checked()) {
      strokeWeight(2);
      stroke("Cyan");
      point(this.x, this.y);
    }
    if (this.data_morte !== "" && this.data_morte > map_ini && deathCheckbox.checked()) {
      stroke("Red");
      point(this.x_morte, this.y_morte);
    }
    strokeWeight(1);
    noFill();

    if (birthCheckbox.checked() && deathCheckbox.checked() && this.data_morte != "") {
      stroke(255, 255, 255, 30);
      arc(
        width / 2,
        height / 2,
        this.r * 2,
        this.r * 2,
        radians(this.angulo_nasc - 90),
        radians(this.angulo_morte - 90)
      );
    }
    stroke(255, 255, 255, 20);
  }

  display_hide() {
    if (this.data_nasc > map_ini && birthCheckbox.checked()) {
      strokeWeight(2);
      stroke(0, 255, 255, 80);
      point(this.x, this.y);
    }
    if (this.data_morte !== "" && this.data_morte > map_ini && deathCheckbox.checked()) {
      stroke(255, 0, 0, 80);
      point(this.x_morte, this.y_morte);
    }
    strokeWeight(1);
    noFill();

    if (birthCheckbox.checked() && deathCheckbox.checked() && this.data_morte != "") {
      stroke(255, 255, 255, 10);
      arc(
        width / 2,
        height / 2,
        this.r * 2,
        this.r * 2,
        radians(this.angulo_nasc - 90),
        radians(this.angulo_morte - 90)
      );
    }
    stroke(255, 255, 255, 20);
  }

  init() {
    this.angulo_nasc = map(this.data_nasc, map_ini, map_fim, 0, 360);
    this.target_angulo = map(this.data_nasc, map_ini, map_fim, 0, 360);
    this.dx = this.target_angulo - this.angulo_nasc;
    this.x = 400 + this.r * cos(radians(this.angulo_nasc - 90));
    this.y = 400 + this.r * sin(radians(this.angulo_nasc - 90));
    this.angulo_nasc = this.angulo_nasc + this.dx * easing;

    this.angulo_morte = this.data_morte !== "" ? map(this.data_morte, map_ini, map_fim, 0, 360) : null;
    this.target_angulo_morte = this.data_morte !== "" ? map(this.data_morte, map_ini, map_fim, 0, 360) : null;
    this.dx = this.target_angulo_morte ? this.target_angulo_morte - this.angulo_morte : 0;
    this.x_morte = this.data_morte !== "" ? 400 + this.r * cos(radians(this.angulo_morte - 90)) : null;
    this.y_morte = this.data_morte !== "" ? 400 + this.r * sin(radians(this.angulo_morte - 90)) : null;
    if (this.data_morte !== "") {
      this.angulo_morte = this.angulo_morte + this.dx * easing;
    }
  }

  update() {
    this.target_angulo = map(this.data_nasc, map_ini, 2020, 0, 360);
    this.dx = this.target_angulo - this.angulo_nasc;
    this.x = 400 + this.r * cos(radians(this.angulo_nasc - 90));
    this.y = 400 + this.r * sin(radians(this.angulo_nasc - 90));
    this.angulo_nasc = this.angulo_nasc + this.dx * easing;

    if (this.data_morte !== "") {
      this.target_angulo_morte = map(this.data_morte, map_ini, map_fim, 0, 360);
      this.dx = this.target_angulo_morte - this.angulo_morte;
      this.x_morte = 400 + this.r * cos(radians(this.angulo_morte - 90));
      this.y_morte = 400 + this.r * sin(radians(this.angulo_morte - 90));
      this.angulo_morte = this.angulo_morte + this.dx * easing;
    }
  }

  highlight() {
    if (
      (mouseX > this.x - 3 &&
        mouseX < this.x + 3 &&
        mouseY > this.y - 3 &&
        mouseY < this.y + 3) ||
      (this.x_morte !== null &&
        mouseX > this.x_morte - 3 &&
        mouseX < this.x_morte + 3 &&
        mouseY > this.y_morte - 3 &&
        mouseY < this.y_morte + 3)
    ) {
      this.ativo = true;
      circle(this.x, this.y, 30);
      stroke(255);
      strokeWeight(1);
      fill(255, 0);
      if (this.data_morte !== "") {
        arc(
          width / 2,
          height / 2,
          this.r * 2,
          this.r * 2,
          radians(this.angulo_nasc - 90),
          radians(this.angulo_morte - 90)
        );
      }
      fill(20, 35, 50);
      circle(this.x, this.y, 5);
      if (this.data_morte !== "") {
        circle(this.x_morte, this.y_morte, 5);
      }
      noStroke();
      rectMode(CENTER);
      rect(width / 2, height / 2, 200, 50);
      fill(255);
      noStroke();
      textSize(16);
      let conc =
        this.nome + " \n (" + this.data_nasc + "\u2013" + " " + this.data_morte + ")";
      textAlign(CENTER);
      text(conc, width / 2, height / 2 - 5);
      counter++;
    } else {
      this.ativo = false;
    }
  }
}
