<template>
  <div class="order-summary-container">
    <h1>Order Summary</h1>
    <div class="order-details">
      <p><strong>Size:</strong> {{ order.size.name }}</p>
      <p><strong>Crust:</strong> {{ order.crust.name }}</p>
      <p>
        <strong>Toppings:</strong>
        <span v-for="(topping, index) in order.toppings" :key="topping.id">
          {{ topping.name }}{{ index < order.toppings.length - 1 ? ',' : '' }}
        </span>
      </p>
      <p>
        <strong>Extras:</strong>
        Cheese: {{ order.extraCheese ? "Yes" : "No" }},
        Sauce: {{ order.extraSauce ? "Yes" : "No" }}
      </p>
      <p><strong>Total Price:</strong> ${{ calculateTotalPrice }}</p>
    </div>

    <form @submit.prevent="confirmOrder" class="customer-form">
      <h3>Customer Details</h3>
      <input type="text" v-model="customer.firstName" placeholder="First Name" required />
      <input type="text" v-model="customer.lastName" placeholder="Last Name" required />
      <input type="text" v-model="customer.phoneNumber" placeholder="Phone Number" required />
      <input type="text" v-model="customer.address" placeholder="Delivery Address" required />
      <button type="submit" class="submit-btn">Confirm Order</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: null,
      customer: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
      },
    };
  },
  computed: {
    // Calculate the total price including size, crust, toppings, and extras
    calculateTotalPrice() {
      let total =
        (this.order.size ? parseFloat(this.order.size.price) : 0) +
        (this.order.crust ? parseFloat(this.order.crust.price) : 0) +
        (this.order.extraCheese ? 2.0 : 0) + // Assuming $2 for extra cheese
        (this.order.extraSauce ? 1.5 : 0); // Assuming $1.5 for extra sauce

      // Add topping prices
      this.order.toppings.forEach((topping) => {
        total += parseFloat(topping.price);
      });

      return total.toFixed(2);
    },
  },
  methods: {
    async confirmOrder() {
      if (!this.customer.firstName || !this.customer.lastName || !this.customer.phoneNumber || !this.customer.address) {
        alert("All customer details are required.");
        return;
      }

      const payload = {
        first_name: this.customer.firstName,
        last_name: this.customer.lastName,
        phone_number: this.customer.phoneNumber,
        address: this.customer.address,
        size_id: this.order.size.id,
        crust_id: this.order.crust.id,
        toppings: this.order.toppings.map(topping => topping.id), // Ensure it's an array of topping IDs
        extra_cheese: this.order.extraCheese,
        extra_sauce: this.order.extraSauce,
        size_price: this.order.size.price,
        crust_price: this.order.crust.price,
        extra_cheese_price: 2.0,
        extra_sauce_price: 1.5,
        total_price: this.calculateTotalPrice,  // Add the total_price here
      };

      console.log("Payload being sent:", payload);

      try {
        const response = await this.$axios.post("/order", payload);
        console.log("Server response:", response);

        // Pass the calculated total price along with the order details to the confirmation page
        this.$router.push({
          path: "/confirmation",
          query: {
            data: JSON.stringify({
              order: response.data,
              calculatedTotalPrice: this.calculateTotalPrice,
            }),
          },
        });
      } catch (error) {
        console.error("Server Error:", error.response?.data || error.message);
        alert(`Failed to confirm order: ${error.response?.data?.error || error.message}`);
      }
    },
  },
  created() {
    try {
      const rawData = this.$route.query.data;
      this.order = JSON.parse(decodeURIComponent(rawData));
    } catch (error) {
      console.error("Failed to parse order data:", error);
      this.$router.push("/"); // Redirect to home if parsing fails
    }
  },
};
</script>

<style scoped>
.order-summary-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}

.order-details {
  margin-bottom: 30px;
}

.order-details p {
  font-size: 1.1rem;
  margin: 10px 0;
}

.customer-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.customer-form input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.submit-btn {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
}

.submit-btn:hover {
  background-color: #218838;
}

@media (max-width: 768px) {
  .order-summary-container {
    padding: 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .order-details p {
    font-size: 1rem;
  }

  .customer-form input {
    font-size: 0.9rem;
  }

  .submit-btn {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .order-summary-container {
    padding: 10px;
  }

  h1 {
    font-size: 1.25rem;
  }

  .order-details p {
    font-size: 0.9rem;
  }

  .customer-form input {
    font-size: 0.85rem;
  }

  .submit-btn {
    font-size: 1rem;
  }
}
</style>
