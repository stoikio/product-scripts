const complexitySums = {};

const addComplexityDiv = () => {
  const rowgroups = Array.from(
    document.querySelectorAll('div[role="rowgroup"]')
  );

  rowgroups.forEach((rowgroup) => {
    const childElement = rowgroup.firstElementChild;

    if (!childElement) {
      return;
    }

    const titleElement = childElement.firstElementChild;
    const rows = Array.from(childElement.querySelectorAll('div[role="row"]'));

    const columnHeaders = document.querySelectorAll('[role="columnheader"]');

    let complexityIndex = -1;

    columnHeaders.forEach((header, index) => {
      if (
        header.firstElementChild &&
        header.firstElementChild.firstElementChild &&
        header.firstElementChild.firstElementChild.textContent === "Complexity"
      ) {
        complexityIndex = index + 1;
      }
    });

    if (!titleElement || !rows || complexityIndex === -1) {
      return;
    }

    const subTitleElement = titleElement.firstElementChild;

    if (!subTitleElement) {
      return;
    }

    const titleSpan = subTitleElement.querySelector(
      'span[class*="prc-Text-Text"]'
    );

    if (!titleSpan) {
      return;
    }

    const titleText = titleSpan.textContent;

    if (!titleText) {
      return;
    }

    const titleId = window.location.pathname + titleText.replace(/\s/g, "-");

    const isOpened =
      subTitleElement.firstElementChild &&
      subTitleElement.firstElementChild.firstElementChild &&
      subTitleElement.firstElementChild.firstElementChild
        .getAttribute("class")
        .endsWith("octicon-chevron-down");

    if (isOpened) {
      const complexityValues = rows.map((row) => {
        const cells = Array.from(row.querySelectorAll('div[role="gridcell"]'));

        const complexityCell = cells[complexityIndex];

        if (
          complexityCell &&
          complexityCell.firstElementChild &&
          complexityCell.firstElementChild.firstElementChild &&
          complexityCell.firstElementChild.firstElementChild
            .firstElementChild &&
          complexityCell.firstElementChild.firstElementChild.firstElementChild
            .firstElementChild &&
          complexityCell.firstElementChild.firstElementChild.firstElementChild
            .firstElementChild.firstElementChild
        ) {
          return complexityCell.firstElementChild.firstElementChild
            .firstElementChild.firstElementChild.firstElementChild.textContent;
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
            return acc + 2.5;
          case "4-5 days":
            return acc + 4.5;
          case "+5 days":
            return acc + 5.5;
          default:
            return acc;
        }
      }, 0);
    }

    let div = subTitleElement.lastElementChild;
    const divClass = "complexity-counter";

    if (typeof complexitySums[titleId] === "number") {
      const number = Math.round(complexitySums[titleId] * 2) / 2;
      const divContent = `${number} day${number > 1 ? "s" : ""}`;

      if (div.class === divClass) {
        if (div.innerHTML !== divContent) {
          div.innerHTML = divContent;
        }
      } else {
        div = document.createElement("div");
        div.class = divClass;
        div.innerHTML = divContent;
        div.style.borderRadius = "999px";
        div.style.backgroundColor =
          "var(--bgColor-accent-muted,var(--color-accent-subtle,#ddf4ff))";
        div.style.borderColor =
          "var(--borderColor-accent-muted,var(--color-accent-muted,rgba(84,174,255,0.4)))";
        div.style.borderStyle = "solid";
        div.style.borderWidth = "1px";
        div.style.paddingLeft = "8px";
        div.style.paddingRight = "8px";

        subTitleElement.appendChild(div);
      }
    } else if (div && div.class === divClass) {
      div.remove();
    }
  });
};

const debounce = (callback, wait) => {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

window.addEventListener("load", () => {
  const root = document.getElementById("memex-project-view-root");
  if (!root) {
    console.warn("Could not find root element (#memex-project-view-root)");
    return;
  }

  const handleMutation = debounce(() => {
    addComplexityDiv();
  }, 10);

  handleMutation();
  const observer = new MutationObserver(handleMutation);
  observer.observe(root, { attributes: false, childList: true, subtree: true });
});
