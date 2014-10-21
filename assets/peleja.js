app = angular.module('Peleja', [])

.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[').endSymbol(']]');
}])

app.service('BattleService', function(){
  combatants = [];
  turnCount = 0;
  combatantSequence = 0;

  this.allCombatants = function(){
    return combatants;
  }

  this.addCombatant = function(combatant){
    if (combatant.type == "pc") {
      newCombatant = combatant
    } else {
      newCombatant    = jQuery.extend({}, combatant);
    }
    newCombatant.id = combatantSequence;
    combatantSequence += 1;
    combatants.unshift(newCombatant);
    this.sortCombatantsByInitiative();
  }

  this.removeCombatant = function(combatant){
    combatants.splice(combatants.indexOf(combatant), 1);
  }

  this.clear = function(){
    combatants.length = 0;
  }

  this.sortCombatantsByInitiative = function(){
    combatants.sort(function(a, b){ 
      if (a.initiative < b.initiative){
        return 1;
      } else {
        if (a.initiative > b.initiative){
          return -1;
        } else {
          return 0;
        }
      }
    })
  }

  this.markFirstAsActive = function(){
    combatants[0].active = !combatants[0].active;
  }

  this.start = function(){
    turnCount = 0;
    this.sortCombatantsByInitiative();
    this.markFirstAsActive();
  }

  this.nextTurn = function(){
    turnCount += 1;
    this.markFirstAsActive();
    combatants.push(combatants.shift());
    this.markFirstAsActive();
  }

});

app.service('CharacterService', function(){
  characters = [
    { 
      type: "pc",
      name: "Andrey Coldheart",
      hp: 13,
      initiative: 0,
      ac: 18,
      xp: 0,
      modifiers: {
        str: 3,
        dex: 1,
        con: 3,
        int: 0,
        wis: 4,
        cha: 5
      },
      attacks: [
        { name: 'Warhammer', dmg: '1d8+3', bonus: 5 },
        { name: 'Warhammer DH', dmg: '1d10+3', bonus: 5 },
        { name: 'Javelin', dmg: '1d6+3', bonus: 5 }
      ],
      languages: ['Abissal', 'Celestial', 'Comum', 'Infernal'],
      passives: {
        insight: 14,
        perception: 12,
      }
    },
    { 
      type: "pc",
      name: "Clunc, o Barbaro",
      hp: 14,
      initiative: 0,
      ac: 17,
      xp: 0,
      modifiers: {
        str: 5,
        dex: 1,
        con: 4,
        int: 0,
        wis: 1,
        cha: 1
      },
      attacks: [
        { name: 'Desarmado', dmg: '4', bonus: 5 },
        { name: 'Espada Longa', dmg: '1d8+3', bonus: 5 },
        { name: 'Javelin', dmg: '1d6+1', bonus: 3 }
      ],
      languages: [ 'Comum', 'Goblin', 'Orc'],
      passives: {
        insight: 11,
        perception: 11,
      }
    },
    { 
      type: "pc",
      name: "Drax",
      hp: 12,
      initiative: 0,
      ac: 12,
      xp: 0,
      modifiers: {
        str: 0,
        dex: 2,
        con: 2,
        int: 5,
        wis: 2,
        cha: 2
      },
      attacks: [
        { name: 'Bordao', dmg: 'd6', bonus: 2 },
        { name: 'Besta', dmg: '1d8+2', bonus: 4 },
      ],
      languages: [ 'Comum', 'Draconico', 'Elfico'],
      passives: { 
        insight: 12,
        perception: 10
      }
    },
    { 
      type: "pc",
      name: "Arck",
      hp: 8,
      initiative: 0,
      ac: 12,
      xp: 0,
      modifiers: {
        str: 0,
        dex: 2,
        con: 4,
        int: 4,
        wis: 2,
        cha: 6
      },
      attacks: [
        { name: 'Bordao', dmg: 'd6', bonus: 2 },
        { name: 'Besta', dmg: '1d8+2', bonus: 4 },
        { name: 'Desarmado', dmg: '2', bonus: 4 },
      ],
      languages: ['Celestial', 'Comum', 'Draconico', 'Elfico'],
      passives: {
        insight: 14,
        perception: 12,
      }
    },
    { 
      type: "npc",
      name: "Kobold",
      hp: 5,
      initiative: 0,
      ac: 12,
      xp: 25,
      modifiers: {
        str: -2,
        dex: 2,
        con: -1,
        int: -1,
        wis: -2,
        cha: -1
      },
      attacks: [
        { name: 'Dagger', dmg: '1d4+2', bonus: 4 },
        { name: 'Sling', dmg: '1d4+2', bonus: 4 }
      ],
      traits: [
        { name: 'Pack Tatics', text: 'Vantagem no ataque a uma criatura quando um aliado esta a 1,5m da criatura' }
      ]
    },
    { 
      type: "npc",
      name: "Guard",
      hp: 11,
      initiative: 0,
      ac: 16,
      xp: 25,
      modifiers: {
        str: 1,
        dex: 1,
        con: 1,
        int: 0,
        wis: 0,
        cha: 0
      },
      attacks: [
        { name: 'weapon', dmg: '1d6+1', bonus: 3 }
      ]
    },
    { 
      type: "npc",
      name: "Cultista",
      hp: 9,
      initiative: 0,
      ac: 12,
      xp: 25,
      modifiers: {
        str: 0,
        dex: 1,
        con: 0,
        int: 0,
        wis: 0,
        cha: 0
      },
      attacks: [
        { name: 'Scimitar', dmg: '1d6+1', bonus: 4 }
      ],
      traits: [
        { name: 'Dark Devotion', text: 'Vantagem contra amedrontar e charm' }
      ]
    },
    { 
      type: "npc",
      name: "Dragonclaw",
      hp: 16,
      initiative: 0,
      ac: 14,
      xp: 200,
      modifiers: {
        str: -1,
        dex: 3,
        con: 1,
        int: 0,
        wis: 2,
        cha: 1
      },
      attacks: [
        { name: 'Multiattack', dmg: '1d6+3', bonus: 5 },
        { name: 'Scimitarra', dmg: '1d6+3', bonus: 5 }
      ],
      traits: [
        { name: 'Dragon Fanatic', text: 'Vantagem contra charme e terror quando pode ver um cultista ou dragao' },
        { name: 'Vantagem Fanatica', text: 'Uma vez por turno, ele faz um ataque com vantagem e se acertar causa 2d6 de dano extra' },
        { name: 'Pack tatics', text: 'Vantagem quando um aliado esta a 1,5m do alvo' }
      ]
    },
    { 
      type: "npc",
      name: "Langderosa Cyanwrath",
      hp: 57,
      initiative: 0,
      ac: 17,
      xp: 1100,
      modifiers: {
        str: 4,
        dex: 1,
        con: 3,
        int: 0,
        wis: 2,
        cha: 1
      },
      attacks: [
        { name: 'Multiattack (GreatSword ou Spear)', dmg: '', bonus: 0 },
        { name: 'GreatSword', dmg: '2d6+4', bonus: 6 },
        { name: 'Spear', dmg: '1d6+4', bonus: 6 },
        { name: 'Lightning Breath', dmg: '4d10', bonus: 6, kind: 'lightning', range: '9m', special: 'Dex DC 13 para 1/2 dano' },
      ],
      traits: [
        { name: 'Action Surge', text: 'Uma acao extra 1/dia' },
        { name: 'Critico Aprimorado', text: 'Critico com 19-20' },
      ]
    },
    { 
      type: "npc",
      name: "Ambush Drake",
      hp: 22,
      initiative: 0,
      ac: 13,
      xp: 100,
      modifiers: {
        str: 1,
        dex: 2,
        con: 2,
        int: -3,
        wis: 0,
        cha: -2
      },
      attacks: [
        { name: 'Bite', dmg: '1d6+1', bonus: 4 },
      ],
      traits: [
        { name: 'Pack Tatics', text: 'Vantagem quando um aliado estiver a 1,5m do alvo' },
        { name: 'Surprise Attack', text: 'Se pegar um inimigo de surpresa e atacar com a mordida, ganha 2d6 de bônus de dano' },
        { name: 'Darkvision', text: '20m' }
      ],
      resistances: ['Poison']
    }
  ];

  this.all = function(){
    return characters;
  }

  this.add = function(character){
    characters.push(character);
  }

  this.pcs = function(){
    return this.all().filter(function(item, index, all){
      return item.type == 'pc';
    })
  }

  this.npcs = function(){
    return this.all().filter(function(item, index, all){
      return item.type == 'npc';
    })
  }

});

app.directive('character', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'character.html'
  }
});

app.controller('CharactersController', ['$scope', 'CharacterService', 'BattleService', function($scope, CharacterService, BattleService){
  $scope.newCharacter = {};

  $scope.combatants = BattleService.allCombatants();

  $scope.pcs        = CharacterService.pcs();
  $scope.npcs       = CharacterService.npcs();

  $scope.startBattle = function(){
    BattleService.start();
  }

  $scope.nextTurn = function(){
    BattleService.nextTurn();
  }

  $scope.createCharacter = function(){
    CharacterService.add($scope.newCharacter);
    $scope.newCharacter = {};
  }

  $scope.addToBattle = function(character){
    BattleService.addCombatant(character);
  }

  $scope.removeFromBattle = function(character){
    BattleService.removeCombatant(character);
  }

  $scope.reorder = function(){
    BattleService.sortCombatantsByInitiative();
  }

  $scope.clear = function(){
    BattleService.clear();
  }

}]);
