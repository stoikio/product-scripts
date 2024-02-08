const complexitySums = {};

const addComplexityDiv = () => {
  const rowgroupElements = Array.from(
    document.querySelectorAll('div[role="rowgroup"]')
  );

  rowgroupElements.forEach((rowgroupElement) => {
    const childElement = rowgroupElement.firstElementChild;

    if (childElement) {
      const titleElement = childElement.firstElementChild;
      const rowElements = childElement.querySelectorAll('div[role="row"]');

      if (titleElement && rowElements) {
        const subTitleElement = titleElement.firstElementChild;

        if (subTitleElement) {
          const titleId = titleElement.getAttribute("data-testid");

          const isOpened =
            subTitleElement.firstElementChild &&
            subTitleElement.firstElementChild.firstElementChild &&
            subTitleElement.firstElementChild.firstElementChild
              .getAttribute("class")
              .endsWith("octicon-chevron-down");

          if (isOpened) {
            const complexityValues = Array.from(rowElements).map((row) => {
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
                return complexityCell.firstElementChild.firstElementChild
                  .firstElementChild.firstElementChild.firstElementChild
                  .textContent;
              }

              return null;
            });

            complexitySums[titleId] = complexityValues.reduce((acc, cur) => {
              switch (cur) {
                case "15 mins":
                  return acc + 0.1;
                case "1 hour":
                  return acc + 0.2;
                case "\u{BD} day":
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
                  return acc;
              }
            }, 0);
          }

          if (complexitySums[titleId]) {
            const divId =
              rowgroupElement.getAttribute("data-testid").replace(/\s/g, "-") +
              "-counter";

            const number = Math.round(complexitySums[titleId] * 2) / 2;

            const divContent = `${number} day${number > 1 ? "s" : ""}`;

            let div = document.getElementById(divId);

            if (div) {
              div.innerHTML = divContent;
            } else {
              div = document.createElement("div");
              div.id = divId;
              div.innerHTML = divContent;
              div.style.borderRadius = "999px";
              div.style.backgroundColor = "rgb(221, 244, 255)";
              div.style.borderColor = "rgba(84, 174, 255, 0.4)";
              div.style.borderStyle = "solid";
              div.style.borderWidth = "1px";
              div.style.paddingLeft = "8px";
              div.style.paddingRight = "8px";

              subTitleElement.appendChild(div);
            }
          }
        }
      }
    }
  });
};

window.onload = () => {
  addComplexityDiv();
  setInterval(addComplexityDiv, 500);

  document.addEventListener("click", addComplexityDiv);
};
