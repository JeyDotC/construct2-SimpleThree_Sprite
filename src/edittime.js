/*
Copyright 2020 Jeysson Guevara (JeyDotC)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
function GetBehaviorSettings()
{
	return {
		"name":			"SimpleThree Sprite",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"SimpleThree_Sprite",			// this is used to SimpleThree_Sprite this behavior and is saved to the project; never change it
		"version":		"1.1",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Converts a sprite in a 3D plane with animations.",
		"author":		"JeyDotC",
		"help url":		"https://github.com/JeyDotC/construct2-SimpleThree_Sprite",
		"category":		"Three Js",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		0						// uncomment lines to enable flags...
					//	| bf_onlyone			// can only be added once to an object, e.g. solid
	};
}

// Actions
AddNumberParam("Elevation", "The new sprite's elevation in 2D Pixels.", 0);
AddAction(0, 0, "Set Sprite Elevation from 2D pixels", "Transform", "Sprite Elevation to <b>{0}</b>", "Set the Sprite's Elevation from 2D pixel length.", "SetElevationFrom2D");

AddNumberParam("Rotation X", "The sprite's X axis rotation in degrees.", 0);
AddAction(1, 0, "Set Sprite X axis rotation", "Transform", "Sprite X axis rotation to <b>{0}</b> degrees", "Set the Sprite's X axis rotation in degrees.", "SetRotationXFrom2D");

AddNumberParam("Rotation Z", "The sprite's Z axis rotation in degrees.", 0);
AddAction(2, 0, "Set Sprite Z Axis Rotation", "Transform", "Sprite Z axis rotation to <b>{0}</b> degrees", "Set the Sprite's Z axis rotation in degrees.", "SetRotationZFrom2D");


AddComboParamOption('No');
AddComboParamOption('Yes');
AddComboParamOption('Only Y Axis');
AddComboParam('Facing Camera Option', 'If this sprite should constantly face the camera.', 0);
AddAction(3, 0, "Set Facing Camera", "Transform", "Facing Camera Option To <b>{0}</b>", "Set if this sprite should face the camera constantly.", "SetFacingCameraOption");

// Conditions

AddCmpParam("Comparison", "");
AddNumberParam("Value", "Value to compare Elevation with", "0");
AddCondition(0, 0, "Compare Elevation", "Transform", "Elevation is {0} to <i>{1}</i>", "Compare the Sprite's current Elevation.", "CompareElevation" );

AddCmpParam("Comparison", "");
AddNumberParam("Angle (degrees)", "Angle to compare Rotation X with in degrees", "0");
AddCondition(1, 0, "Compare Rotation X", "Transform", "Rotation X is {0} to <i>{1}</i>", "Compare the Sprite's current Rotation X.", "CompareRotationX" );

AddCmpParam("Comparison", "");
AddNumberParam("Angle (degrees)", "Angle to compare Rotation Z with in degrees", "0");
AddCondition(2, 0, "Compare Rotation Z", "Transform", "Rotation Z is {0} to <i>{1}</i>", "Compare the Sprite's current Rotation Z.", "CompareRotationZ" );

// Expressions
AddExpression(0, ef_return_number, "Elevation", "Transform", "Elevation", "The Sprite Elevation in Pixels.");
AddExpression(1, ef_return_number, "Rotation X", "Transform", "RotationX", "The Sprite Rotation X in Degrees.");
AddExpression(2, ef_return_number, "Rotation Z", "Transform", "RotationZ", "The Sprite Rotation Z in Degrees.");

////////////////////////////////////////
ACESDone();

var property_list = [
	/* 0*/ new cr.Property(ept_integer, "Elevation", 0, "How height is this sprite elevated from ground in 2D pixels."),
	/* 1*/ new cr.Property(ept_float, "Rotation X", 0, "Rotation on the X axis in degrees."),
	/* 2*/ new cr.Property(ept_float, "Rotation Z", 0, "Rotation on the Z axis in degrees."),
	/* 3*/ new cr.Property(ept_combo, "Facing Camera", "No", "Make this sprite constantly be oriented towards the camera.", "No|Yes|Only Y Axis"),

	/*--*/ new cr.Property(ept_section, "Advanced"),
	/* 4*/ new cr.Property(ept_combo, "Enable 2D Render", "Disabled", "If whether or not this object's 2D render will happen, disabling it saves a lot of processing power.", "Disabled|Enabled"),
	/* 5*/ new cr.Property(ept_combo, "Magnification Filter", "Linear", "How the texture is sampled when a texel covers more than one pixel.", "Linear|Nearest"),
	/* 6*/ new cr.Property(ept_combo, "Minification Filter", "Linear Filter", "How the texture is sampled when a texel covers less than one pixel.", "Nearest Filter|Nearest Mipmap Nearest Filter|Nearest Mipmap Linear Filter|Linear Filter|Linear Mipmap Nearest Filter|Linear Mipmap Linear Filter"),
];

// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
};

// Class representing an individual instance of the behavior in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
};

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};
