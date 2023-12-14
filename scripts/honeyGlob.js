/*****************************************
**************  GLOB CLASS  **************
*****************************************/

// class HoneyGlob extends Projectile {
    class HoneyGlob {
        constructor(pos, dir, playerVelocityX) {
            this.position = pos;
            this.dir = dir;
            this.size = new Vector2(4, 4);
            this.damage = random(50, 100);
            this.critPercent = 50;
            this.critDamagePercent = 3;
    
            this.velocity = new Vector2(0, -100);
            this.movementAcceleration = 9000.0;
            this.playerVelocityX = Math.abs(playerVelocityX);
            this.maxSpeed = 400.0 + (this.playerVelocityX || 0);
    
            this.airDrag = 0.09;
    
            // Vertical
            this.gravity = 300.0;
            this.maxFallSpeed = 250.0;
    
            this.hasHit = false;
    
            this.sprite = new Circle(pos, 4, '#ebaf4c', '#ebaf4c');
    
            this.rect = new Rectangle(this.position.x + 2, this.position.y + 2, this.size.x - 2, this.size.y - 2);
        }
    
        GetDirection() {
            return this.dir;
        }
    
        GetDamage() {
            const isCrit = (random(0, 100) <= this.critPercent);
            const critPercent = isCrit ? this.critDamagePercent : 1;
            const amount = this.damage * critPercent;
            return { amount, isCrit };
        }
    
        GetHasHit() {
            return this.hasHit;
        }
    
        GetPosition() {
            return this.position;
        }

        GetSize() {
            return this.size;
        }

        GetRect() {
            return this.rect;
        }
    
        SetHasHit(hasHit) {
            this.hasHit = hasHit;
        }
    
        Update() {
            const elapsed = GameTime.getElapsed();
    
            // Horizontal Movement
            this.velocity.x += this.dir * this.movementAcceleration;
            this.velocity.x *= this.airDrag;
            this.velocity.x = Clamp(
                this.velocity.x,
                -this.maxSpeed,
                this.maxSpeed
            );
    
            this.position.x += this.velocity.x * elapsed;
            this.position.x = Math.round(this.position.x);
    
            // Vertical Movement
            this.velocity.y = Clamp(
                this.velocity.y + this.gravity * elapsed,
                -this.maxFallSpeed,
                this.maxFallSpeed
            );
            // this.velocity.y = this.Arc(this.velocity.y);
            this.position.y += this.velocity.y * elapsed;
            this.position.y = Math.round(this.position.y);
    
            this.sprite.SetCenter(this.position);
            this.rect.Update(this.position, this.size);
        }
    
        Draw() {
    
            this.sprite.Draw();
            
        }
    
    }