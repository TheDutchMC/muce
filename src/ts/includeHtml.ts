export function includeHTML(): void {
        /* Loop through a collection of all HTML elements: */
        var tags = document.getElementsByTagName("*");
        for (var i = 0; i < tags.length; i++) {
          var elmnt = tags[i];
          /*search for elements with a certain atrribute:*/
          var file = elmnt.getAttribute("muce-include");
          if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4) {
                if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                /* Remove the attribute, and call this function once more: */
                elmnt.removeAttribute("muce-include");
                includeHTML();
              }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
          }
        }
      }