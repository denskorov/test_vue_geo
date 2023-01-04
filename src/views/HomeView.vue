<template>
  <div class="home">
    <h3>Posts</h3>
    <div>
      <p>Filter by title:</p>
      <div><input type="text" v-model="filterText" /></div>
    </div>
    <hr />
    <div>
      <button @click="toPrev" :disabled="!canGoToPrev || loading">
        Prev page
      </button>
      <button style="margin-right: 15px" @click="toNext" :disabled="loading">
        Next page
      </button>
      <b>Page: {{ page }}</b>
    </div>
    <hr />
    <template v-if="!loading">
      <ul>
        <li v-for="post in filteredPosts" :key="post.id" style="display: flex">
          <div style="flex-basis: 50%">
            <h4>{{ post.title }}</h4>
            <p>{{ post.body }}</p>
            <p>
              Count of comments:
              <b>{{ post.comments.length }}</b>
            </p>
          </div>
          <div>
            <Doughnut
              :options="{
                responsive: true,
                maintainAspectRatio: false,
              }"
              :data="post.chartData"
            />
          </div>
        </li>
      </ul>
    </template>
    <template v-else> Loading </template>
  </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "HomeView",
  data: () => ({
    posts: [],
    filterText: "",
    limit: 5,
    page: 1,
    loading: false,
  }),
  components: {
    Doughnut,
  },
  async beforeMount() {
    await this.getPosts();
  },
  computed: {
    filteredPosts() {
      return this.posts.filter((post) => post.title.includes(this.filterText));
    },
    canGoToPrev() {
      return this.page > 1;
    },
  },
  methods: {
    async getPosts() {
      this.loading = true;
      const { data } = await this.axios.get("/posts", {
        params: {
          _limit: this.limit,
          _page: this.page,
        },
      });

      this.posts = await Promise.all(
        data.map(async (post) => {
          const { data: comments } = await this.axios.get(
            `/posts/${post.id}/comments`
          );
          return {
            ...post,
            comments,
            chartData: this.getChartDataByComments(comments),
          };
        })
      );
      this.loading = false;
    },
    toPrev() {
      this.page--;
      this.getPosts();
    },
    toNext() {
      const prevPage = this.page;
      this.page++;
      this.getPosts().then(() => {
        if (!this.posts.length) {
          this.page = prevPage;
          this.getPosts();
        }
      });
    },
    getChartDataByComments(comments) {
      return {
        labels: comments.map((c) => c.email),
        datasets: [
          {
            backgroundColor: comments.map(
              () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
            ),
            data: comments.map((c) => c.email.length),
          },
        ],
      };
    },
  },
};
</script>
