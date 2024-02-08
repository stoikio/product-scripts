console.log(123);
const addComplexityDiv = () => {
  Array.from(document.querySelectorAll('div[data-testid^="table-group-"]'))
    .filter(
      (element) =>
        !element.getAttribute("data-testid").startsWith("table-group-footer-")
    )
    .forEach((groupElement) => {
      const childElement = groupElement.firstElementChild;

      if (childElement) {
        const titleElement = childElement.firstElementChild;
        const rowsElement = childElement.querySelectorAll('div[role="row"]');

        if (titleElement && rowsElement) {
          const complexityValues = Array.from(rowsElement).map((row) => {
            const complexityCell = row.querySelector(
              'div[data-testid*="Complexity"]'
            );

            return complexityCell &&
              complexityCell.firstElementChild &&
              complexityCell.firstElementChild.firstElementChild &&
              complexityCell.firstElementChild.firstElementChild
                .firstElementChild &&
              complexityCell.firstElementChild.firstElementChild
                .firstElementChild.firstElementChild &&
              complexityCell.firstElementChild.firstElementChild
                .firstElementChild.firstElementChild.firstElementChild
              ? complexityCell.firstElementChild.firstElementChild
                  .firstElementChild.firstElementChild.firstElementChild
                  .textContent
              : null;
          });

          const complexitySum = complexityValues.reduce((acc, cur) => {
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
              default: {
                return acc;
              }
            }
          }, 0);

          const divId =
            groupElement.dataset.testid.replace(/\s/g, "-") + "-counter";
          let div = document.getElementById(divId);

          if (complexitySum) {
            const subChildElement = titleElement.firstElementChild;

            if (subChildElement) {
              const divContent = `${Math.round(complexitySum * 2) / 2} day${
                complexitySum > 1 ? "s" : ""
              }`;

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
                subChildElement.appendChild(div);
              }
            }
          } else if (div) {
            div.remove();
          }
        }
      }
    });
};

addComplexityDiv();

const scrollContainer = document.querySelector(
  'div[data-testid="table-scroll-container"]'
);
if (scrollContainer) {
  scrollContainer.addEventListener("scroll", addComplexityDiv);
}

document.addEventListener("mousemove", addComplexityDiv);

document.addEventListener("click", addComplexityDiv);
