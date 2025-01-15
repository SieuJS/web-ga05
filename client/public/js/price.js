import { getPriceRange, setPrice, setLinkAndReload } from "./product-query.js";

const priceSliderElement = document.querySelector('.slider-range');

const priceRange = getPriceRange() ;
priceSliderElement.innerHTML = ``;
const slideElement = `
     <div
                        data-min="0"
                        data-max="3000"
                        data-unit="$"
                        class="slider-range-price ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"
                        data-value-min="${priceRange[0]}"
                        data-value-max="${priceRange[1]}"
                        data-label-result="Price:"
                      >
                        <div
                          class="ui-slider-range ui-widget-header ui-corner-all"
                        ></div>
                        <span
                          class="ui-slider-handle ui-state-default ui-corner-all"
                          tabindex="0"
                        ></span>
                        <span
                          class="ui-slider-handle ui-state-default ui-corner-all"
                          tabindex="0"
                        ></span>
                      </div>
                      <div class="range-price">Price: ${priceRange[0]} - ${priceRange[1]}</div>
                      <input type="hidden" id="price-min" value = "${priceRange[0]}" />
                      <input type="hidden" id="price-max" value="${priceRange[1]}" />
                      <div class="search_form mt-4">
                        <button id="price-btn" class ="submit text-center col-12">Submit</button>
                      </div>
`
priceSliderElement.innerHTML += slideElement;

(function($){
    $('.slider-range-price').each(function () {
        var min = jQuery(this).data('min');
        var max = jQuery(this).data('max');
        var unit = jQuery(this).data('unit');
        var value_min = jQuery(this).data('value-min');
        var value_max = jQuery(this).data('value-max');
        var label_result = jQuery(this).data('label-result');
        var t = $(this);
        $(this).slider({
            range: true,
            min: min,
            max: max,
            values: [value_min, value_max],
            slide: function (event, ui) {
                var result = label_result + " " + unit + ui.values[0] + ' - ' + unit + ui.values[1];
                t.closest('.slider-range').find('.range-price').html(result);
                t.closest('.slider-range').find('#price-min').val(ui.values[0]);
                t.closest('.slider-range').find('#price-max').val(ui.values[1]);
            }
        });
    })
})(jQuery);


