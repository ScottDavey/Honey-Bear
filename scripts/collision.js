/**********************************************
**************  COLLISION CLASS  **************
**********************************************/

class Collision {

    constructor(collisionData) {
        this.collisionData = collisionData;
        this.lines = [];

        this.Initialize();
    }

    Initialize() {
        this.lines = this.collisionData.map(collision => {
            return new Line(
                new Vector2(collision.sx, collision.sy),    // Start position vector
                new Vector2(collision.ex, collision.ey),    // End position vector
                collision.h,                                // Line color
                collision.c,                                // Collision type (FLOOR, WALL, CEILING)
                collision.n,                                // Line Normal (which way to push the entity)
                collision.s,                                // Line Sound (when collided with)
                collision.sl,                               // Slope (or, the m in y = mx + b)
                collision.b                                 // Y Intercept (or, the b in y = mx + b)
            );
        });
    }

    CheckLineCollisionEntity(entity) {
        const isMovingUp = entity.velocity.y < 0;
        const bounds = new Rectangle(entity.position.x, entity.position.y, entity.size.x, entity.size.y);

        entity.isOnGround = false;
        entity.isHittingWall = false;

        // Lines
        for (const line of this.lines) {
            const slope = line.slope;
            const b = line.b;
            const isWithinLineX = (bounds.center.x >= line.startPos.x && bounds.center.x <= line.endPos.x);
            const isWithinLineY = (bounds.center.y > line.startPos.y && bounds.center.y < line.endPos.y);

            // CHECK AGAINST WALL COLLISIONS
            if (line.collision === 'WALL' && isWithinLineY) {

                const xDiff = Math.abs(bounds.center.x - line.startPos.x);

                if (xDiff <= bounds.halfSize.x) {
                    entity.position.x =
                        line.normal < 0
                            ? line.startPos.x - bounds.width
                            : line.startPos.x;
                    entity.velocity.x = 0;
                    entity.isHittingWall = true;
                }

            }
            
            // FLOOR AND CEILING COLLISION
            if ((line.collision === 'FLOOR' || line.collision === 'CEILING') && isWithinLineX) {

                let y = slope * bounds.center.x + b;

                // FLOOR
                if (line.collision === 'FLOOR' && !isMovingUp) {

                    // If the bottom of the player is less than 10 pixels below the line, shoot him back up
                    if (Math.abs(y - bounds.bottom) <= 10) {
                        y = Math.floor(y);
                        entity.position.y = y - bounds.height;
                        entity.velocity.y = 0
                        entity.isOnGround = true;
                    }

                }

                // CEILING
                if (line.collision === 'CEILING' && isMovingUp) {
                    
                    if (Math.abs(y - bounds.top) <= 10) {
                        y = Math.floor(y);
                        entity.position.y = y + 5;  // Hack to solve a problem with a certain slant of ceiling
                        entity.velocity.y = 0;
                    }
                }

            }
        }
    }

    CheckLineCollisionRect(rectBounds) {

        for (const line of this.lines) {
            const slope = line.slope;
            const b = line.b;
            const yc = (slope * rectBounds.center.x) + b;

            if ((line.collision == 'FLOOR' || line.collision == 'CEILING') && rectBounds.center.x >= line.startPos.x && rectBounds.center.x <= line.endPos.x) {

                if (Math.abs(yc - rectBounds.center.y) <= rectBounds.halfSize.y + 5) {
                    return true;
                }

            } else if (line.collision == 'WALL' && rectBounds.center.y > line.startPos.y && rectBounds.center.y < line.endPos.y) {

                const xDiff = Math.abs(rectBounds.center.x - line.startPos.x);
                if (xDiff <= rectBounds.halfSize.x + 5) {
                    return true;
                }

            }
        }

        return false;
    }

    CheckBoxCollision(box1, box2) {
        
    }

    DrawCollisionLines(cameraPos) {
        for (const line of this.lines) {
            const linePos = line.GetPos();
            // Only render if the lines are visible.
            if ((linePos.start.x > cameraPos[0] && linePos.start.x < (cameraPos[0] + CANVAS_WIDTH)) || (linePos.end.x > cameraPos[0] && linePos.end.x < (cameraPos[0] + CANVAS_WIDTH))) {
                line.Draw();
            }
        }
    }


}