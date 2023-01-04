<template>
  <div class="home container">
    <div class="d-flex justify-content-between align-items-center">
      <h3>Пости</h3>
      <div class="d-flex align-items-center">
        <label class="m-0 mr-3 w-50">Фільтрувати за заголовком:</label>
        <input type="text" class="form-control" v-model="filterText" />
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <button
          @click="toPrev"
          :disabled="!canGoToPrev || loading"
          class="btn border mr-2"
        >
          Попередня стрінка
        </button>
        <button
          style="margin-right: 15px"
          @click="toNext"
          :disabled="loading"
          class="btn border"
        >
          Наступна сторінка
        </button>
        <span class="mr-2"
          >Сторінка: <b>{{ page }}</b></span
        >
      </div>
      <div>
        <span class="mr-4">Постів на сторінці:</span>
        <select @change="updateLimit" :value="limit">
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>
    </div>
    <template v-if="!loading">
      <ul class="p-0 m-0">
        <li v-for="post in filteredPosts" :key="post.id" style="display: block">
          <hr />
          <div class="d-flex justify-content-between">
            <div class="flex-grow-1 p-3">
              <h4>{{ post.title }}</h4>
              <p>{{ post.body }}</p>
              <p>
                Count of comments:
                <b>{{ post.comments.length }}</b>
              </p>
            </div>
            <div class="text-center border-left p-3" style="max-width: 350px">
              <h6>Статистика літер у `email` авторів коментарів</h6>
              <div>
                <Doughnut
                  :options="{
                    responsive: true,
                    maintainAspectRatio: false,
                  }"
                  :data="post.chartData"
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template v-else>
      <div class="pt-5 text-center">Loading...</div>
    </template>
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
      return this.posts.filter((post) =>
        post.title.toLowerCase().includes(this.filterText.toLowerCase())
      );
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
    async updateLimit(e) {
      this.page = 1;
      this.limit = e.target.value;
      await this.getPosts();
    },
  },
};
</script>
