const StorageCtrl = (function () {
  return {
    addLocal: function (data) {
      localStorage.setItem('items', JSON.stringify(data));
    },
    getLocal: function () {
      const data = JSON.parse(localStorage.getItem('items'));
      if (data !== null) {
        return data;
      } else {
        return [];
      }
    },
  };
})();

const ItemCtrl = (function () {
  const Item = function (mealName, calories, id) {
    this.mealName = mealName;
    this.calories = calories;
    this.id = id;
  };

  return {
    data: [],
    addItem: function (mealName, calories, id) {
      const newItem = new Item(mealName, calories, id);
      this.data.push(newItem);
    },
    getTotalCalories: function () {
      let calories = 0;
      this.data.forEach((el) => {
        calories += el.calories;
      });
      return calories;
    },
    current: null,
  };
})();

const UICtrl = (function () {
  document.querySelectorAll('input').forEach((e) => {
    e.addEventListener('input', (e) => {
      if (e.target.value !== '') {
        e.target.nextElementSibling.style.top = '-12px';
        e.target.nextElementSibling.style.visibility = 'visible';
        e.target.nextElementSibling.style.color = '#fff';
      } else {
        e.target.nextElementSibling.style.visibility = 'hidden';
        e.target.nextElementSibling.style.top = '10px';
        e.target.nextElementSibling.style.color = '#999';
      }
    });
  });

  return {
    displayItems: function (items) {
      let output = '';
      items.forEach((it) => {
        output += `
        <div class="item it-${it.id}">
        <div class="left">
          <span class="MealName">${it.mealName}</span>
        <span><em>&nbsp;|| Calories:</em> <span class="itemCal">${it.calories}</span></span>
        </div>
        <div class="right">
          <i class="fas fa-edit"></i>
        </div>
      </div>
        `;
      });
      document.querySelector('.items').innerHTML = output;
    },
    clearInputs: function () {
      document.querySelector('.meal').value = '';
      document.querySelector('.calories').value = '';
      document.querySelectorAll('input').forEach((e) => {
        e.nextElementSibling.style.visibility = 'hidden';
        e.nextElementSibling.style.top = '10px';
        e.nextElementSibling.style.color = '#999';
      });
    },
    editstate_on: function () {
      document.querySelector('.editstate').style.display = 'flex';
      document.querySelector('.add_btn').style.display = 'none';
      document.querySelectorAll('input').forEach((e) => {
        e.nextElementSibling.style.visibility = 'visible';
        e.nextElementSibling.style.top = '-12px';
        e.nextElementSibling.style.color = '#fff';
      });
    },
    editstate_off: function (items, calories) {
      document.querySelector('.editstate').style.display = 'none';
      document.querySelector('.add_btn').style.display = 'inline-block';
      this.clearInputs();
      if (items && calories) {
        this.displayItems(items);
        this.setCalories(calories);
      } else {
        this.displayItems([]);
        this.setCalories(0);
      }
    },
    setCalories: function (totalCals) {
      document.querySelector('.CalNr').innerHTML = totalCals;
    },
    setInputs: function (it) {
      document.querySelector('.meal').value = it.mealName;
      document.querySelector('.calories').value = it.calories;
    },
  };
})();

const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  const loadEventsListeners = function () {
    document.querySelector('.add_btn').addEventListener('click', () => {
      const mealName = document.querySelector('.meal').value;
      const calories = parseInt(document.querySelector('.calories').value);
      const id = Math.round(Math.random() * 999999);

      if (mealName !== '' && calories) {
        UICtrl.clearInputs();
        ItemCtrl.addItem(mealName, calories, id);
        StorageCtrl.addLocal(ItemCtrl.data);
        UICtrl.displayItems(ItemCtrl.data);
        document.querySelector(
          '.CalNr'
        ).innerHTML = ItemCtrl.getTotalCalories();
      }
    });

    document.querySelector('.save').addEventListener('click', () => {
      ItemCtrl.data[ItemCtrl.current].mealName = document.querySelector(
        '.meal'
      ).value;
      ItemCtrl.data[ItemCtrl.current].calories = parseInt(
        document.querySelector('.calories').value
      );
      StorageCtrl.addLocal(ItemCtrl.data);
      UICtrl.editstate_off(ItemCtrl.data, ItemCtrl.getTotalCalories());
    });

    document.querySelector('.delete').addEventListener('click', () => {
      ItemCtrl.data.splice(ItemCtrl.current, 1);
      StorageCtrl.addLocal(ItemCtrl.data);
      if (ItemCtrl.data) {
        UICtrl.editstate_off(ItemCtrl.data, ItemCtrl.getTotalCalories());
      }
    });

    document.querySelector('.back').addEventListener('click', () => {
      UICtrl.editstate_off(ItemCtrl.data, ItemCtrl.getTotalCalories());
    });

    document.querySelector('.items').addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-edit')) {
        UICtrl.editstate_on();
        const id = parseInt(
          e.target.parentElement.parentElement.classList[1].split('-')[1]
        );
        ItemCtrl.data.forEach((it, i) => {
          if (it.id === id) {
            UICtrl.setInputs(it);
            ItemCtrl.current = i;
          }
        });
      }
    });
  };

  return {
    init: function () {
      ItemCtrl.data = StorageCtrl.getLocal();
      UICtrl.setCalories(ItemCtrl.getTotalCalories());
      UICtrl.displayItems(ItemCtrl.data);
      loadEventsListeners();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();