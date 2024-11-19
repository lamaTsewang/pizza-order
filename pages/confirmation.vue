<template>
  <div class="order-confirmation-container">
    <h1>Order Confirmation</h1>
    <div v-if="order" class="order-details">
      <p><strong>Order ID:</strong> {{ order.order.id }}</p>
      <p><strong>Name:</strong> {{ order.order.first_name }} {{ order.order.last_name }}</p>
      <p><strong>Phone:</strong> {{ order.order.phone_number }}</p>
      <p><strong>Address:</strong> {{ order.order.address }}</p>
      <p><strong>Total Price:</strong> ${{ calculatedTotalPrice }}</p> <!-- Display the frontend calculated price -->
    </div>
    <div v-else>
      <p>Loading order confirmation...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: null, // Store the confirmation data here
      calculatedTotalPrice: null, // Store the calculated total price
    };
  },
  created() {
    try {
      const rawData = this.$route.query.data;
      const parsedData = JSON.parse(decodeURIComponent(rawData));
      this.order = parsedData.order; // Get the order details from the query
      this.calculatedTotalPrice = parsedData.calculatedTotalPrice; // Get the calculated total price
    } catch (error) {
      console.error("Failed to parse order confirmation data:", error);
      alert("Failed to load order confirmation.");
      this.$router.push("/"); // Redirect to home if parsing fails
    }
  },
};
</script>

<style scoped>
.order-confirmation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.order-details {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-details p {
  font-size: 1.1rem;
  margin: 10px 0;
}

@media (max-width: 768px) {
  .order-confirmation-container {
    padding: 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .order-details p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .order-confirmation-container {
    padding: 10px;
  }

  h1 {
    font-size: 1.25rem;
  }

  .order-details p {
    font-size: 0.9rem;
  }
}
</style>
