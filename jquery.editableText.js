/*!
 * editableText plugin that uses contentEditable property (FF2 is not supported)
 * Project page - http://github.com/valums/editableText
 * Copyright (c) 2009 Andris Valums, http://valums.com
 * Licensed under the MIT license (http://valums.com/mit-license/)
 */
(function($){
    /**
     * Extending jQuery namespace, we
     * could add public methods here
     */
    $.editableText = {};
    $.editableText.defaults = {
        /**
         * Pass true to enable line breaks.
         * Useful with divs that contain paragraphs.
         */
        newlinesEnabled : false,
        /**
         * Event that is triggered when editable text is changed
         */
        changeEvent : 'change'
    };

    /**
     * Usage $('selector).editableText(optionArray);
     * See $.editableText.defaults for valid options
     */
    $.fn.editableText = function(options){
        options = $.extend({}, $.editableText.defaults, options || {});

        return this.each(function() {
            // Add jQuery methods to the element
            var
                editable = $(this),

                /**
                 * Save value to restore if user presses cancel
                 */
                prevValue = editable.html(),

                // Create edit/save buttons
                buttons = $(
                    '<div class="editableToolbar">' +
                    '<a href="#" class="edit"/>' +
                    '<a href="#" class="save"/>' +
                    '<a href="#" class="cancel"/>' +
                    '</div>').insertBefore(editable),

                // Save references and attach events
                editEl = buttons.find('.save').bind('click', { save: true }, stopEditing).end()
                    .find('.cancel').bind('click', { save: false }, stopEditing).end()
                    .children().css('display', 'none').end()
                    .find('.edit').bind('click', startEditing).show();

            if (!options.newlinesEnabled) {
                // Prevents user from adding newlines to headers, links, etc.
                editable.keypress(function(event) {
                    // event is cancelled if enter is pressed
                    return event.which !== 13;
                });
            }

            /**
             * Makes element editable
             */
            function startEditing(){
                buttons.children().show();
                editEl.hide();
                editable.attr('contentEditable', true);
                return false;
            }

            /**
             * Makes element non-editable
             */
            function stopEditing(e) {
               buttons.children().hide();
                editEl.show();
                editable.attr('contentEditable', false);

                if (e.data.save) {
                    editable.trigger(options.changeEvent);
                } else {
                    editable.html(prevValue);
                }

                return false;
            }
        });
    }
})(jQuery);
