import random

class Character:
    def __init__(self, name, hp, attack, defense):
        self.name = name
        self.max_hp = hp
        self.hp = hp
        self.attack = attack
        self.defense = defense
        self.is_alive = True

    def take_damage(self, damage):
        actual_damage = max(1, damage - self.defense)
        self.hp -= actual_damage
        if self.hp <= 0:
            self.hp = 0
            self.is_alive = False
        return actual_damage

    def heal(self, amount):
        self.hp = min(self.max_hp, self.hp + amount)

class Battle:
    def __init__(self, player, enemy):
        self.player = player
        self.enemy = enemy
        self.turn = 1

    def player_turn(self):
        # Basic attack
        damage = random.randint(self.player.attack - 2, self.player.attack + 2)
        dealt_damage = self.enemy.take_damage(damage)
        return f"{self.player.name} attacks {self.enemy.name} for {dealt_damage} damage!"

    def enemy_turn(self):
        # Enemy basic attack
        damage = random.randint(self.enemy.attack - 1, self.enemy.attack + 1)
        dealt_damage = self.player.take_damage(damage)
        return f"{self.enemy.name} attacks {self.player.name} for {dealt_damage} damage!"

    def battle_loop(self):
        print(f"Battle starts: {self.player.name} vs {self.enemy.name}")
        
        while True:
            # Player turn
            print(f"\nTurn {self.turn}")
            print(f"{self.player.name} HP: {self.player.hp}/{self.player.max_hp}")
            print(f"{self.enemy.name} HP: {self.enemy.hp}/{self.enemy.max_hp}")
            
            print(self.player_turn())
            if not self.enemy.is_alive:
                print(f"\n{self.player.name} wins!")
                return True

            # Enemy turn
            print(self.enemy_turn())
            if not self.player.is_alive:
                print(f"\n{self.enemy.name} wins!")
                return False

            self.turn += 1

# Example usage
if __name__ == "__main__":
    # Create characters
    player = Character("Hero", hp=100, attack=15, defense=5)
    enemy = Character("Dragon", hp=80, attack=12, defense=3)

    # Initialize and start battle
    battle = Battle(player, enemy)
    battle.battle_loop()