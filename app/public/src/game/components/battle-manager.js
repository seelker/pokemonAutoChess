import {GameObjects} from 'phaser';
import {SPECIAL_SKILL} from '../../../../models/enum';
import Pokemon from './pokemon';

export default class BattleManager {
  constructor(scene, group, player) {
    this.group = group;
    this.scene = scene;
    this.player = player;
    this.opponentNameText = this.scene.add.text(1270, 25, this.player.opponentName.slice(0, 8), window.textStyle);
  }

  buildPokemons() {
    this.player.simulation.blueTeam.forEach((pkm, key) => {
      this.addPokemon(this.player.id, pkm);
    });

    this.player.simulation.redTeam.forEach((pkm, key) => {
      this.addPokemon(this.player.id, pkm);
    });
  }

  addPokemon(playerId, pokemon) {
    if (this.player.id == playerId) {
      const coordinates = window.transformAttackCoordinate(pokemon.positionX, pokemon.positionY);
      const pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon, false, true);
      window.animationManager.animatePokemon(pokemonUI);
      this.group.add(pokemonUI);
    }
  }

  clear() {
    this.group.clear(false, true);
  }

  removePokemon(playerId, pokemon) {
    if (this.player.id == playerId) {
      this.group.getChildren().forEach((pkm) => {
        if (pkm.id == pokemon.id) {
          pkm.destroy();
        }
      });
    }
  }

  changePokemonItems(playerId, change, pokemon) {
    if (this.player.id == playerId) {
      const children = this.group.getChildren();
      for (let i = 0; i < children.length; i++) {
        if (children[i].id == pokemon.id) {
          if (change.field == 'item0' && change.value == '') {
            const item = children[i].getFirst('place', 'item0');
            if (item) {
              children[i].remove(item);
            }
          } else if (change.field == 'item0' && change.value != '') {
            children[i].setItem0(change.value);
          } else if (change.field == 'item1' && change.value == '') {
            const item = children[i].getFirst('place', 'item1');
            if (item) {
              children[i].remove(item);
            }
          } else if (change.field == 'item1' && change.value != '') {
            children[i].setItem1(change.value);
          } else if (change.field == 'item2' && change.value == '') {
            const item = children[i].getFirst('place', 'item2');
            if (item) {
              children[i].remove(item);
            }
          } else if (change.field == 'item2' && change.value != '') {
            children[i].setItem2(change.value);
          }
        }
      }
    }
  }

  changePokemon(playerId, change, pokemon) {
    if (this.player.id == playerId) {
      const children = this.group.getChildren();
      for (let i = 0; i < children.length; i++) {
        if (children[i].id == pokemon.id) {
          if (change.field =='positionX' || change.field == 'positionY') {
            // console.log(pokemon.positionX, pokemon.positionY);
            if (change.field == 'positionX') {
              children[i].positionX = pokemon.positionX;
            } else if (change.field == 'positionY') {
              children[i].positionY = pokemon.positionY;
            }
            const coordinates = window.transformAttackCoordinate(pokemon.positionX, pokemon.positionY);
            if (pokemon.skill == SPECIAL_SKILL.TELEPORT) {
              children[i].x = coordinates[0];
              children[i].y = coordinates[1];
              children[i].specialAttackAnimation();
            } else {
              children[i].moveManager.moveTo(coordinates[0], coordinates[1]);
            }
          } else if (change.field == 'orientation') {
            children[i].orientation = pokemon.orientation;
            window.animationManager.animatePokemon(children[i]);
          } else if (change.field =='action') {
            children[i].action = pokemon.action;
          } else if (change.field == 'atkSpeed') {
            children[i].atkSpeed = pokemon.atkSpeed;
            const detail = children[i].getFirst('objType', 'detail');
            if (detail) {
              detail.atkSpeed.setText(pokemon.atkSpeed);
            }
          } else if (change.field =='life') {
            if (change.value && change.previousValue) {
              this.displayDamage(children[i].x, children[i].y, change.value - change.previousValue);
            }
            children[i].life = pokemon.life;
            children[i].getFirst('objType', 'lifebar').setLife(children[i].life);
            const detail = children[i].getFirst('objType', 'detail');
            if (detail) {
              detail.hp.setText(pokemon.life);
            }
          } else if (change.field =='mana') {
            children[i].mana = pokemon.mana;
            children[i].getFirst('objType', 'manabar').setLife(children[i].mana);
            const detail = children[i].getFirst('objType', 'detail');
            if (change.previousValue > change.value) {
              children[i].specialAttackAnimation();
            }
            if (detail) {
              detail.mana.setText(pokemon.mana);
            }
          } else if (change.field == 'atk') {
            children[i].atk = pokemon.atk;
            const detail = children[i].getFirst('objType', 'detail');
            if (detail) {
              detail.atk.setText(pokemon.atk);
            }
          } else if (change.field == 'def') {
            children[i].def = pokemon.def;
            const detail = children[i].getFirst('objType', 'detail');
            if (detail) {
              detail.def.setText(pokemon.def);
            }
          } else if (change.field == 'speDef') {
            children[i].speDef = pokemon.speDef;
            const detail = children[i].getFirst('objType', 'detail');
            if (detail) {
              detail.speDef.setText(pokemon.speDef);
            }
          } else if (change.field == 'range') {
            children[i].range = pokemon.range;
            const detail = children[i].getFirst('objType', 'detail');
            if (detail) {
              detail.atkSpeed.setText(pokemon.range);
            }
          } else if (change.field =='targetX') {
            if (pokemon.targetX >= 0) {
              children[i].targetX = pokemon.targetX;
            } else {
              children[i].targetX = null;
            }

            if (children[i].action == 'ATTACKING' && children[i].targetX !== null && children[i].targetY !== null) {
              window.animationManager.animatePokemon(children[i]);
              children[i].attackAnimation();
            }
          } else if (change.field =='targetY') {
            if (pokemon.targetY >= 0) {
              children[i].targetY = pokemon.targetY;
            } else {
              children[i].targetY = null;
            }

            if (children[i].action == 'ATTACKING' && children[i].targetX !== null && children[i].targetY !== null) {
              window.animationManager.animatePokemon(children[i]);
              children[i].attackAnimation();
            }
          } else if (change.field == 'poison') {
            if (pokemon.poison) {
              children[i].addPoison();
            } else {
              children[i].removePoison();
            }
          } else if (change.field == 'sleep') {
            if (pokemon.sleep) {
              children[i].addSleep();
            } else {
              children[i].removeSleep();
            }
          } else if (change.field == 'burn') {
            if (pokemon.burn) {
              children[i].addBurn();
            } else {
              children[i].removeBurn();
            }
          } else if (change.field == 'silence') {
            if (pokemon.silence) {
              children[i].addSilence();
            } else {
              children[i].removeSilence();
            }
          } else if (change.field == 'confusion') {
            if (pokemon.confusion) {
              children[i].addConfusion();
            } else {
              children[i].removeConfusion();
            }
          } else if (change.field == 'freeze') {
            if (pokemon.freeze) {
              children[i].addFreeze();
            } else {
              children[i].removeFreeze();
            }
          } else if (change.field == 'protect') {
            if (pokemon.protect) {
              children[i].addProtect();
            } else {
              children[i].removeProtect();
            }
          }
          break;
        }
      }
    }
  }

  displayDamage(x, y, damage) {
    let color;
    let damageText;
    if (damage >= 0) {
      color='green';
      damageText = `+${damage}`;
    } else {
      color='red';
      damageText = damage;
    }
    const text = this.scene.add.existing(new GameObjects.Text(this.scene, x-25, y -30, damageText, window.textStyle));
    text.setDepth(9);

    this.scene.add.tween({
      targets: [text],
      ease: 'Linear',
      duration: 1000,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => y - 30,
        getEnd: () => y - 90
      },
      onComplete: () => {
        text.destroy(true);
      }
    });
  }

  setPlayer(player) {
    if (player.id != this.player.id) {
      this.player = player;
      this.group.clear(true, true);
      this.opponentNameText.setText(this.player.opponentName.slice(0, 8));
      this.buildPokemons();
    }
  }

  setOpponentName(name){
    this.opponentNameText.setText(name);
  }
}
