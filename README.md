# SimpleThree Sprite
**Type:** Behavior

Converts a sprite in a 3D plane with animations.

# Properties

| Name | Type | Description | Options |
|------|------|-------------|---------|
|**Elevation**| _integer_ | How height is this sprite elevated from ground in 2D pixels.  |  |
|**Rotation X**| _float_ | Rotation on the X axis in degrees.  |  |
|**Rotation Z**| _float_ | Rotation on the Z axis in degrees.  |  |
|**Facing Camera**| _combo_ | Make this sprite constantly be oriented towards the camera. Default value: `No` | - No<br/>- Yes<br/>- Only Y Axis |

# ACES

## Actions

| Name | Description | Parameters |
|------|-------------|------------|
| |**Transform**| |
|**Set Sprite Elevation from 2D pixels**| Set the Sprite's Elevation from 2D pixel length. | - **Elevation** _number_: The new sprite's elevation in 2D Pixels.  |
|**Set Sprite X axis rotation**| Set the Sprite's X axis rotation in degrees. | - **Rotation X** _number_: The sprite's X axis rotation in degrees.  |
|**Set Sprite Z Axis Rotation**| Set the Sprite's Z axis rotation in degrees. | - **Rotation Z** _number_: The sprite's Z axis rotation in degrees.  |
|**Set Facing Camera**| Set if this sprite should face the camera constantly. | - **Facing Camera Option** _combo_: If this sprite should constantly face the camera.  **Options**: (`No`, `Yes`, `Only Y Axis`) |

## Conditions

| Name | Description | Parameters |
|------|-------------|------------|
| |**Transform**| |
|**Compare Elevation**| Compare the Sprite's current Elevation. | - **Comparison** _comparison_:  <br />- **Value** _number_ = `0`: Value to compare Elevation with  |
|**Compare Rotation X**| Compare the Sprite's current Rotation X. | - **Comparison** _comparison_:  <br />- **Angle (degrees)** _number_ = `0`: Angle to compare Rotation X with in degrees  |
|**Compare Rotation Z**| Compare the Sprite's current Rotation Z. | - **Comparison** _comparison_:  <br />- **Angle (degrees)** _number_ = `0`: Angle to compare Rotation Z with in degrees  |

## Expressions

| Name | Type | Description | Parameters |
|------|------|-------------|------------|
| | |**Transform**| |
|**Elevation**<br/><small>**Usage:** `MyObject.SimpleThree Sprite.Elevation`</small>|`number`| The Sprite Elevation in Pixels. |  |
|**Rotation X**<br/><small>**Usage:** `MyObject.SimpleThree Sprite.RotationX`</small>|`number`| The Sprite Rotation X in Degrees. |  |
|**Rotation Z**<br/><small>**Usage:** `MyObject.SimpleThree Sprite.RotationZ`</small>|`number`| The Sprite Rotation Z in Degrees. |  |