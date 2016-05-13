/*

  a bootstrap like style

*/
'use strict';

var LABEL_COLOR = '#000000';
var INPUT_COLOR = '#000000';
var ERROR_COLOR = '#a94442';
var HELP_COLOR = '#999999';
var BORDER_COLOR = '#cccccc';
var DISABLED_COLOR = '#777777';
var DISABLED_BACKGROUND_COLOR = '#eeeeee';
var FONT_SIZE = 15;
var FONT_WEIGHT = '500';

var stylesheet = {
  fieldset: {},
  // the style applied to the container of all inputs
  formGroup: {
    normal: {
      // flexDirection: "row",
      // justifyContent : 'flex-start',
      padding: 5,
      marginBottom: 5,
    },
    error: {
      // flexDirection: "row",
      padding: 5,
      marginBottom: 5
    }
  },
  controlLabel: {
    normal: {
      color: LABEL_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 7,
      fontWeight: FONT_WEIGHT,
      //marginRight : 10,
      //flex: 0.3
    },
    // the style applied when a validation error occours
    error: {
      color: ERROR_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 7,
      fontWeight: FONT_WEIGHT
    }
  },
  helpBlock: {
    normal: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 5
    },
    // the style applied when a validation error occours
    error: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE,
      marginBottom: 5
    }
  },
  errorBlock: {
    fontSize: FONT_SIZE,
    marginBottom: 5,
    color: ERROR_COLOR
  },
  textbox: {
    normal: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      height: 36,
      padding: 5,
      borderRadius: 10,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      marginBottom: 5,
      width : 250,

    },
    // the style applied when a validation error occours
    error: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      height: 36,
      padding: 5,
      borderRadius: 10,
      borderColor: ERROR_COLOR,
      borderWidth: 1,
      marginBottom: 5,
      width : 250,
    },
    // the style applied when the textbox is not editable
    notEditable: {
      fontSize: FONT_SIZE,
      height: 36,
      padding: 5,
      borderRadius: 10,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      marginBottom: 5,
      color: DISABLED_COLOR,
      backgroundColor: DISABLED_BACKGROUND_COLOR,
      width : 250,
    }
  },
  checkbox: {
    normal: {
      // color: INPUT_COLOR,
      marginBottom: 5
    },
    // the style applied when a validation error occours
    error: {
      // color: INPUT_COLOR,
      marginBottom: 5
    }
  },
  select: {
    normal: {
      marginTop: 2,
      marginBottom: 12,
      height : 30
    },
    // the style applied when a validation error occours
    error: {
        marginTop: 2,
      marginBottom: 12,
      height: 30
    }
  },
  datepicker: {
    normal: {
      marginBottom: 4,

    },
    // the style applied when a validation error occours
    error: {
      marginBottom: 4
    }
  }
};

module.exports = stylesheet;
