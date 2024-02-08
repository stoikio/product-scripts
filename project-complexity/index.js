const complexitySums = {};

// Define a function to add a complexity summary to each group of elements
const addComplexityDiv = () => {
  // Select all divs that represent groups of items but not the footer groups
  Array.from(document.querySelectorAll('div[data-testid^="table-group-"]'))
    .filter(
      // Exclude elements that are footers of the groups
      (element) =>
        !element.getAttribute("data-testid").startsWith("table-group-footer-")
    )
    .forEach((groupElement) => {
      // Get the first child of the group element, typically containing the title and rows
      const childElement = groupElement.firstElementChild;

      if (childElement) {
        // Get the title element and all row elements within the group
        const titleElement = childElement.firstElementChild;
        const rowsElement = childElement.querySelectorAll('div[role="row"]');

        if (titleElement && rowsElement) {
          // Map each row to its complexity value, if it exists
          const complexityValues = Array.from(rowsElement).map((row) => {
            // Deeply nested selection of the complexity cell within each row
            const complexityCell = row.querySelector(
              'div[data-testid*="Complexity"]'
            );

            if (
              complexityCell &&
              complexityCell.firstElementChild &&
              complexityCell.firstElementChild.firstElementChild &&
              complexityCell.firstElementChild.firstElementChild
                .firstElementChild &&
              complexityCell.firstElementChild.firstElementChild
                .firstElementChild.firstElementChild &&
              complexityCell.firstElementChild.firstElementChild
                .firstElementChild.firstElementChild.firstElementChild
            ) {
              // Return the text content of the deepest nested element, which is the complexity value
              return complexityCell.firstElementChild.firstElementChild
                .firstElementChild.firstElementChild.firstElementChild
                .textContent;
            }

            return null; // Return null if no complexity value is found
          });

          const titleId = titleElement.getAttribute("data-testid");
          console.log(titleId)

          // Calculate the sum of complexity values, converting text values to numerical representations
          complexitySums[titleId] = complexityValues.reduce((acc, cur) => {
            switch (cur) {
              case "15 mins":
                return acc + 0.1;
              case "1 hour":
                return acc + 0.2;
              case "\u{BD} day": // Unicode character for ½
                return acc + 0.5;
              case "1 day":
                return acc + 1;
              case "2-3 days":
                return acc + 3;
              case "4-5 days":
                return acc + 5;
              case "+5 days":
                return acc + 6;
              default:
                return acc; // Default case to just return the accumulator
            }
          }, 0);

          if (complexitySums[titleId]) {
            // Get the sub child element of the title to append the complexity div
            const subChildElement = titleElement.firstElementChild;

            if (subChildElement) {
              // Construct an ID for the complexity div based on the group element's testid
              const divId =
                groupElement.dataset.testid.replace(/\s/g, "-") + "-counter";

              // Format the complexity sum for display
              const divContent = `${Math.round(complexitySum * 2) / 2} day${
                complexitySum > 1 ? "s" : ""
              }`;

              let div = document.getElementById(divId);

              if (div) {
                // If the div already exists, update its content
                div.innerHTML = divContent;
              } else {
                // Create a new div, style it, and append it to the subChildElement
                div = document.createElement("div");
                div.id = divId;
                div.innerHTML = divContent;
                // Apply styling to the newly created div
                div.style.borderRadius = "999px";
                div.style.backgroundColor = "rgb(221, 244, 255)";
                div.style.borderColor = "rgba(84, 174, 255, 0.4)";
                div.style.borderStyle = "solid";
                div.style.borderWidth = "1px";
                div.style.paddingLeft = "8px";
                div.style.paddingRight = "8px";
                subChildElement.appendChild(div);
              }
            }
          }
        }
      }
    });
};

// Run the addComplexityDiv function when the window loads
window.onload = () => {
  addComplexityDiv();
  setInterval(addComplexityDiv, 1000);

  // Re-calculate and display complexity on click events
  document.addEventListener("click", addComplexityDiv);
};
