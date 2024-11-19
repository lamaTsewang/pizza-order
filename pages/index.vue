<template>
  <div class="pizza-config-container">
    <h1>Choose your Pizza</h1>
    <form @submit.prevent="goToSummary" class="pizza-config-form">
      <div class="section">
        <h3>Choose Size</h3>
        <select v-model="selected.size" class="dropdown">
          <option disabled value="">Select Size</option>
          <option v-for="size in options.sizes" :key="size.id" :value="size">
            {{ size.name }} (${{ size.price }})
          </option>
        </select>
      </div>

      <div class="section">
        <h3>Choose Crust</h3>
        <select v-model="selected.crust" class="dropdown">
          <option disabled value="">Select Crust</option>
          <option v-for="crust in options.crusts" :key="crust.id" :value="crust">
            {{ crust.name }} (${{ crust.price }})
          </option>
        </select>
      </div>

      <div class="section">
        <h3>Choose Toppings</h3>
        <div v-for="topping in options.toppings" :key="topping.id" class="option-item">
          <label>
            <input type="checkbox" :value="topping" v-model="selected.toppings" />
            {{ topping.name }} (${{ topping.price }})
          </label>
        </div>
      </div>

      <div class="section">
        <h3>Extras</h3>
        <label>
          <input type="checkbox" v-model="selected.extraCheese" />
          Extra Cheese (${{ extraPrices.cheese }})
        </label>
        <label>
          <input type="checkbox" v-model="selected.extraSauce" />
          Extra Sauce (${{ extraPrices.sauce }})
        </label>
      </div>

      <h2>Total Price: ${{ calculateTotalPrice }}</h2>
      <button type="submit" class="submit-btn">Next</button>
    </form>

    <!-- Error message display -->
    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        sizes: [],
        crusts: [],
        toppings: [],
      },
      extraPrices: {
        cheese: 2.0,
        sauce: 1.5,
      },
      selected: {
        size: null,
        crust: null,
        toppings: [],
        extraCheese: false,
        extraSauce: false,
      },
      errorMessage: '', // For error message display
    };
  },
  computed: {
    calculateTotalPrice() {
      let total =
        (this.selected.size ? parseFloat(this.selected.size.price) : 0) +
        (this.selected.crust ? parseFloat(this.selected.crust.price) : 0) +
        (this.selected.extraCheese ? this.extraPrices.cheese : 0) +
        (this.selected.extraSauce ? this.extraPrices.sauce : 0);

      this.selected.toppings.forEach((topping) => {
        total += parseFloat(topping.price);
      });

      return total.toFixed(2);
    },
  },
  methods: {
    async fetchOptions() {
      try {
        const response = await this.$axios.get('/options');
        this.options = response.data;
      } catch (error) {
        console.error("Failed to fetch options:", error.response?.data || error.message);
        alert("Failed to load pizza options.");
      }
    },
    goToSummary() {
      // Validate if all fields are selected
      if (!this.selected.size || !this.selected.crust || this.selected.toppings.length === 0) {
        this.errorMessage = 'Please select a size, a crust, and at least one topping.';
        return; // Stop form submission if validation fails
      }

      // Reset error message if everything is valid
      this.errorMessage = '';

      const orderData = {
        ...this.selected,
        totalPrice: this.calculateTotalPrice,
      };

      this.$router.push({ path: '/summary', query: { data: JSON.stringify(orderData) } });
    },
  },
  created() {
    this.fetchOptions();
  },
};
</script>

<style scoped>
.pizza-config-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}

.pizza-config-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h3 {
  margin: 0;
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.option-item {
  margin-bottom: 10px;
  font-size: 1rem;
}

label {
  display: flex;
  align-items: center;
  gap: 10px;
}

input[type="radio"],
input[type="checkbox"] {
  margin-right: 10px;
}

.dropdown {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

h2 {
  font-size: 1.5rem;
  text-align: center;
  margin-top: 20px;
}

.submit-btn {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: center;
}

.submit-btn:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 20px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .pizza-config-container {
    padding: 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .pizza-config-form {
    gap: 15px;
  }

  .section {
    padding: 8px;
  }

  .submit-btn {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .pizza-config-container {
    padding: 10px;
  }

  h1 {
    font-size: 1.25rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  .option-item {
    font-size: 0.9rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  .submit-btn {
    font-size: 1rem;
  }
}
</style>
