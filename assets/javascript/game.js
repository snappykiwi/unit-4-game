
let characters = {

  luke: {
    health: 120,
    attack: 11
  },

  leia: {
    health: 150,
    attack: 8
  },

  yoda: {
    health: 90,
    attack: 15
  },

  atdp: {
    health: 145,
    attack: 20
  },

  tarkin: {
    health: 65,
    attack: 6
  },

  stormtrooper: {
    health: 80,
    attack: 9
  }

}


$(document).ready(function () {

  //global variables
  let screen1 = $('div.screen1');
  let screen2 = $('div.screen2');
  let screen3 = $('div.screen3');
  let youWinScreen = $('div.you-win-screen');
  let youLoseScreen = $('div.you-lose-screen');

  let rebelsDiv = $('div.cont-rebels');
  let imperialsDiv = $('div.cont-imperials');
  let chosenHeroDiv = $('div.chosen-hero');
  let chosenEnemyDiv = $('div.chosen-enemy');
  let chosenHero = $('img.chosen-hero');
  let chosenEnemy = $('img.chosen-enemy');
  let $defeatedEnemies = $('div.defeated-enemies');
  let chooseCharacText = $('p.choose');
  let $yourSide = $('span.your-side');
  let $otherSide = $('span.other-side');

  let characterImg = $('img.character');

  let lukeHealth = $('span.luke');
  let leiaHealth = $('span.leia');
  let yodaHealth = $('span.yoda');
  let atdpHealth = $('span.atdp');
  let tarkinHealth = $('span.tarkin');
  let stormtrooperHealth = $('span.stormtrooper');

  let heroAttack;
  let enemyAttack;
  let newAttack;
  let comboCounter = 0;
  let combo;

  let heroHealthText;
  let enemyHealthText;

  let heroHealth;
  let enemyHealth;

  let heroSide;
  let enemySide;

  let enemyName;
  let heroName;

  let battleStarted = false;




  let reset = function () {
    lukeHealth.text(characters.luke.health);
    leiaHealth.text(characters.leia.health);
    yodaHealth.text(characters.yoda.health);
    atdpHealth.text(characters.atdp.health);
    tarkinHealth.text(characters.tarkin.health);
    stormtrooperHealth.text(characters.stormtrooper.health);
    battleStarted = false;

  }

  // sets values and spans of battling hero and enemy
  let setChosenValues = function () {
    if (chosenHeroDiv.has('img').length && chosenEnemyDiv.has('img').length) {

      heroName = chosenHero.attr('name');
      enemyName = chosenEnemy.attr('name');

      enemyAttack = characters[enemyName]['attack'];
      heroAttack = characters[heroName]['attack'];

      heroHealth = characters[heroName]['health'];
      enemyHealth = characters[enemyName]['health'];

      $('span.hero-name').text(heroName);
      $('span.enemy-name').text(enemyName);
      $('span.hero-damage').text(heroAttack);
      $('span.enemy-damage').text(enemyAttack);
    }
  }

  // sets values for enemy user chooses to fight
  let setChosenEnemy = function () {
    enemyName = chosenEnemy.attr('name');

    enemyAttack = characters[enemyName]['attack'];
    enemyHealth = characters[enemyName]['health'];

    $('span.enemy-name').text(enemyName);
    $('span.enemy-damage').text(enemyAttack);
  }

  // check to see if hero or enemy has been defeated
  let isDefeated = function () {
    setSideSpan(heroSide, enemySide);
    if (enemyHealth <= 0) {
      chosenEnemy.removeClass('chosen-enemy')
      chosenEnemyDiv.contents().appendTo($defeatedEnemies);
      $('button.attack').hide();
      $("p.player-attack").hide();
      $("p.combo").hide();
      $('p.enemy-defeated').text(`${chosenEnemy.attr('name')} has been defeated`).fadeIn();

      if (heroSide === "rebels") {

        if (imperialsDiv.has('img').length) {
          chooseCharacText.text("choose another character to fight").fadeIn();
        }
        else {
          screen3.fadeOut();
          youWinScreen.fadeIn();
        }
      }
      else {
        if (rebelsDiv.has('img').length) {
          chooseCharacText.text("choose another character to fight").fadeIn();
        }
        else {
          screen3.fadeOut();
          youWinScreen.fadeIn();
        }
      }
      return true;
    }
    else if (heroHealth <= 0) {
      screen3.fadeOut();
      youLoseScreen.fadeIn();
      return true;
    }
    else {
      return false;
    }
  }

  // reduces players' health by amount they were attacked
  let attack = function () {
    enemyHealth -= parseInt(newAttack);
    isDefeated();
    console.log(isDefeated());
    if (!isDefeated()) {
      heroHealth -= parseInt(enemyAttack)
      isDefeated();
      $('p.player-attack').css('visibility', 'visible').hide().fadeIn('slow');
    }

    newAttack += heroAttack;
    $('span.hero-damage').text(newAttack - heroAttack);
    heroHealthText.text(heroHealth)
    enemyHealthText.text(enemyHealth)
  }

  let comboAttack = function () {
    combo = Math.floor(Math.random() * 2);
    console.log(combo);
    if (!isDefeated()) {
      if (combo) {
        comboCounter++;
        if (comboCounter > 1) {
          $('p.combo').text('Combo!').css('visibility', 'visible').hide().fadeIn('slow');
          newAttack += heroAttack
        }
        else {
          $('p.combo').hide();
          newAttack = heroAttack;
        }
        $('span.hero-damage').text(newAttack);
        enemyHealth -= parseInt(newAttack);
        $('p.player-attack').css('visibility', 'visible').hide().fadeIn('slow');
      }
      else {
        comboCounter = 0;
        newAttack = heroAttack
        $('p.combo').text('you missed').css('visibility', 'visible').hide().fadeIn('slow');
        $('span.hero-damage').text(0);
      }
      heroHealthText.text(heroHealth)
      enemyHealthText.text(enemyHealth)

      heroHealth -= parseInt(enemyAttack)
      isDefeated();
    }
  }


  // check to see if you are fighting the final enemy
  let finalEnemy = function () {
    if (enemySide == "rebels" && !rebelsDiv.has('img').length) {
      $('h2.rebel-side-title').fadeOut();
      $('h2.battle').text("FINAL BATTLE!")
    }
    else if (enemySide == "imperials" && !imperialsDiv.has('img').length) {
      $('h2.imperial-side-title').fadeOut();
      $('h2.battle').text("FINAL BATTLE!")
    }
  };

  //set end of game screen wording
  let setSideSpan = function (heroSide, enemySide) {
    $yourSide.text(heroSide.toUpperCase());
    $otherSide.text(enemySide.toUpperCase());
  };

  // begin game
  reset();


  // jquery events

  // hover display health
  characterImg.mouseenter(
    function () {
      $(this).next().slideDown();
    }
  )
  characterImg.mouseleave(
    function () {
      $(this).next().slideUp();
    }
  )

  //choose a character
  characterImg.on('click', function (event) {
    const $this = $(this);

    if (!chosenHeroDiv.has('img').length) {
      $this.next().addClass('hero-health')
      heroHealthText = $('p.hero-health > span')
      chosenHeroDiv.append($this.next());
      chosenHeroDiv.append($this);
      ($this).addClass('chosen-hero')
      chosenHero = $('img.chosen-hero');

      screen3.fadeIn();

      if ($this.attr("side") === "rebel") {
        rebelsDiv.fadeOut();
        heroSide = "rebels";
        enemySide = "imperials";
      }
      else {
        imperialsDiv.fadeOut();
        heroSide = "imperials";
        enemySide = "rebels";
      }
      chooseCharacText.text("choose a character to fight")
    }
    else if (!chosenEnemyDiv.has('img').length) {
      $('p.enemy-defeated').fadeOut();
      $this.next().addClass('enemy-health')
      enemyHealthText = $('p.enemy-health > span')
      chosenEnemyDiv.append($this.next());
      chosenEnemyDiv.append($this);
      ($this).addClass('chosen-enemy')
      chosenEnemy = $('img.chosen-enemy');
      chooseCharacText.fadeOut();
      setChosenEnemy();
      $('button.attack').show();
      finalEnemy();
    }
  });

  //choose imperial or rebel
  $("span.choice").on('click', function (event) {
    let _this = $(this);
    let choice = _this.attr("choice");
    if (choice === "rebels") {
      rebelsDiv.fadeIn();
    }
    else {
      imperialsDiv.fadeIn();
    }
    screen2.hide();
  });


  // attack enemy
  $('button.attack').on('click', function () {
    if (!battleStarted) {
      setChosenValues();
      newAttack = parseInt(heroAttack);
    }
    comboAttack();
    isDefeated();
    // attack();

    battleStarted = true;
  });

});