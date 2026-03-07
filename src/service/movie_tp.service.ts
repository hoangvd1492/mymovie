import { getCache, setCache } from "@/lib/redis/redis";

import axios from "axios";
import * as cheerio from "cheerio";

const BASE_WEB = "https://thungphim.me.uk/";

export const MovieService = {
  //Lấy danh mục
  getTopics: async (): Promise<any[]> => {
    const CACHE_KEY = "movie:topic";
    const cached = await getCache<any[]>(CACHE_KEY);

    if (cached) return cached;

    try {
      const { data } = await axios.get(BASE_WEB, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      console.log($);

      const result = $("div.menu-item-sub")
        .eq(0)
        .find("a.dropdown-item")
        .map((_, el) => {
          const title = $(el).text().trim();
          const href = $(el).attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop();

          return {
            title,
            slug,
          };
        })
        .get();

      await setCache(CACHE_KEY, result);

      return result;
    } catch (error) {
      console.error("Crawl error:", error);
      return [];
    }
  },

  //Lấy danh sách quốc gia
  getCountries: async (): Promise<any[]> => {
    const CACHE_KEY = "movie:countries";
    const cached = await getCache<any[]>(CACHE_KEY);

    if (cached) return cached;

    try {
      const { data } = await axios.get(BASE_WEB, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      const result = $("div.menu-item-sub")
        .eq(1)
        .find("a.dropdown-item")
        .map((_, el) => {
          const title = $(el).text().trim();
          const href = $(el).attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop();

          return {
            title,
            slug,
          };
        })
        .get();
      await setCache(CACHE_KEY, result);

      return result;
    } catch (error) {
      console.error("Crawl error:", error);
      return [];
    }
  },

  //Lấy chi tiết
  getDetail: async (slug: string): Promise<any> => {
    if (!slug) return null;

    const CACHE_KEY = `movie:detail:${slug}`;
    const cached = await getCache<any>(CACHE_KEY);
    // if (cached) return cached;

    try {
      const { data } = await axios.get(`${BASE_WEB}/chi-tiet-phim/${slug}`);
      const $ = cheerio.load(data);

      const title = $("div.ds-info h2.media-name").text().trim();
      const alias = $("div.ds-info div.alias-name").text().trim();

      let poster =
        $("div.background-fade")
          .attr("style")
          ?.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || null;

      if (poster && !poster.startsWith("http")) {
        poster = BASE_WEB + poster;
      }

      let thumbnail = $("div.ds-info .v-thumbnail img").attr("src") || null;

      if (thumbnail && !thumbnail.startsWith("http")) {
        thumbnail = BASE_WEB + thumbnail;
      }

      const description = $("div.ds-info div.description").text();

      const episodes = $("#tab-eps a.item")
        .map((_, el) => {
          const name =
            $(el).find(".media-title").text() || $(el).find(".info").text();
          const href = $(el).attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          return {
            name,
            slug,
          };
        })
        .get();

      const meta: any = {};

      $(".detail-line").each((_, el) => {
        const label = $(el).find(".de-title").text().replace(":", "").trim();

        const valueEl = $(el).find(".de-value");

        if (!label) return;

        if (valueEl.find("a").length) {
          meta[label] = valueEl
            .find("a")
            .map((_, a) => $(a).text().trim())
            .get();
        } else {
          meta[label] = valueEl.text().trim();
        }
      });

      const tags = $(".tag-classic span")
        .map((_, el) => $(el).text().trim())
        .get();

      tags.push(meta["Quốc gia"]);

      const genres = $(".tag-topic")
        .map((_, el) => $(el).text().trim())
        .get();

      const recommend = $("#tab-suggest .sw-item")
        .map((_, item) => {
          const link = $(item).find("a.v-thumbnail");

          const href = link.attr("href") || "";
          const slug = href.split("/").filter(Boolean).pop() || null;

          const title = link.find("img").attr("alt")?.trim() || "";

          let thumbnail = link.find("img").attr("src") || null;

          if (thumbnail && !thumbnail.startsWith("http")) {
            thumbnail = BASE_WEB + thumbnail;
          }

          return {
            slug,
            title,
            thumbnail,
          };
        })
        .get();

      const actors = $("#tab-cast .item-title a")
        .map((_, el) => $(el).text().trim())
        .get();

      const result = {
        slug,
        poster,
        thumbnail,
        title,
        alias,
        description,
        duration: meta["Thời lượng"] || null,
        director: meta["Đạo diễn"] || [],
        actors,
        tags,
        genres,
        recommend: recommend.slice(0, 10),
        episodes,
      };

      await setCache(CACHE_KEY, result);
      return result;
    } catch (error) {
      console.error("Crawl error:", error);
      return null;
    }
  },

  getStreamingLink: async (
    movieSlug: string,
    epSlug?: string,
  ): Promise<string | null> => {
    const CACHE_KEY = `movie:stream:${movieSlug}:${epSlug ?? "single"}`;

    const cached = await getCache<string>(CACHE_KEY);
    if (cached) return cached;

    try {
      const url = [BASE_WEB, "xem-phim", movieSlug, epSlug]
        .filter(Boolean)
        .join("/");

      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Referer: BASE_WEB,
        },
      });

      const html = await res.text();

      // Bắt link index.m3u8 trong HTML
      const match = html.match(/https?:\/\/[^"' ]+index\.m3u8[^"' ]*/i);

      if (!match) {
        console.error("Không tìm thấy m3u8");
        return null;
      }

      const m3u8Url = match[0];

      console.log(m3u8Url);

      await setCache(CACHE_KEY, m3u8Url, 3600);

      return m3u8Url;
    } catch (err) {
      console.error("Streaming error:", err);
      return null;
    }
  },

  //tìm kiếm bằng topic
  getMovieByGenres: async (
    genreSlug: string,
    page: number = 1,
  ): Promise<{
    results: any[];
    totalPage: number;
    current: number;
  }> => {
    const CACHE_KEY = `movie:genre:${genreSlug}:${page}`;

    const cached = await getCache<{
      results: any[];
      totalPage: number;
      current: number;
    }>(CACHE_KEY);

    if (cached) return cached;

    try {
      const url =
        page === 1
          ? `${BASE_WEB}/the-loai/${genreSlug}`
          : `${BASE_WEB}/the-loai/${genreSlug}/page/${page}/`;

      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      const results = $("div.cards-grid-wrapper div.sw-item")
        .map((_, item) => {
          const title = $(item).find("h4.item-title").text().trim() || "";

          const alias = $(item).find("h4.alias-title").text().trim() || "";

          const href = $(item).find("a.v-thumbnail").attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          const src = $(item).find("img").attr("src") || "";

          const thumbnail = src.startsWith("http") ? src : BASE_WEB + src;

          const duration = $(item).find("div.movie-duration").text() || "N/A";

          return {
            slug,
            title,
            thumbnail,
            duration,
            alias,
          };
        })
        .get();

      const current = Number($("input#jump-page-input").val()) || page;

      const totalPage = Number($("input#jump-page-input").attr("max")) || 1;

      const payload = {
        results,
        current,
        totalPage,
      };

      await setCache(CACHE_KEY, payload);

      return payload;
    } catch (error) {
      console.error("Crawl error:", error);

      return {
        results: [],
        current: 0,
        totalPage: 0,
      };
    }
  },

  //Lấy banner
  getBanner: async (): Promise<any[]> => {
    try {
      const CACHE_KEY = "home:spotlight";

      const cached = await getCache<any[]>(CACHE_KEY);
      if (cached) return cached;

      const { data } = await axios.get(BASE_WEB, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      });

      const $ = cheerio.load(data);

      const result = $("div.slider-chinh div.swiper-slide")
        .map((_, item) => {
          const title = $(item).find("h3.media-title").text().trim();

          const alias = $(item).find("h3.media-alias-title").text();

          const href = $(item).find("a.slide-url").attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          const style = $(item).find("div.background-fade").attr("style") || "";

          const poster = style.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || "";

          return {
            slug,
            alias,
            title,
            poster,
          };
        })
        .get();

      await setCache(CACHE_KEY, result);

      return result;
    } catch (error) {
      console.error("Crawl error:", error);
      return [];
    }
  },

  // Lấy phim theo quốc gia
  getMovieByCountry: async (
    countrySlug: string,
    page: number = 1,
  ): Promise<{
    results: any[];
    totalPage: number;
    current: number;
  }> => {
    const CACHE_KEY = `movie:country:${countrySlug}:${page}`;

    const cached = await getCache<{
      results: any[];
      totalPage: number;
      current: number;
    }>(CACHE_KEY);

    if (cached) return cached;

    const src =
      page === 1
        ? `${BASE_WEB}/quoc-gia/${countrySlug}`
        : `${BASE_WEB}/quoc-gia/${countrySlug}/page/${page}`;

    try {
      const { data } = await axios.get(src, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      const results = $("div.cards-grid-wrapper div.sw-item")
        .map((_, item) => {
          const title = $(item).find("h4.item-title").text().trim() || "";

          const alias = $(item).find("h4.alias-title").text().trim() || "";

          const href = $(item).find("a.v-thumbnail").attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          const src = $(item).find("img").attr("src") || "";

          const thumbnail = src.startsWith("http") ? src : BASE_WEB + src;

          const duration = $(item).find("div.movie-duration").text() || "N/A";

          return {
            slug,
            title,
            thumbnail,
            duration,
            alias,
          };
        })
        .get();

      const current = Number($("input#jump-page-input").val()) || page;

      const totalPage = Number($("input#jump-page-input").attr("max")) || 1;

      const payload = {
        results,
        current,
        totalPage,
      };

      await setCache(CACHE_KEY, payload);

      return payload;
    } catch (error) {
      console.error("Crawl error:", error);

      return {
        results: [],
        current: 0,
        totalPage: 0,
      };
    }
  },

  // Lấy phim bộ
  getPhimBo: async (
    page: number = 1,
  ): Promise<{
    results: any[];
    totalPage: number;
    current: number;
  }> => {
    const CACHE_KEY = `movie:phim-bo:${page}`;

    const cached = await getCache<{
      results: any[];
      totalPage: number;
      current: number;
    }>(CACHE_KEY);

    if (cached) return cached;

    const src =
      page === 1
        ? `${BASE_WEB}/danh-muc/phim-bo`
        : `${BASE_WEB}/danh-muc/phim-bo/page/${page}`;

    try {
      const { data } = await axios.get(src, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      const results = $("div.cards-grid-wrapper div.sw-item")
        .map((_, item) => {
          const title = $(item).find("h4.item-title").text().trim() || "";

          const alias = $(item).find("h4.alias-title").text().trim() || "";

          const href = $(item).find("a.v-thumbnail").attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          const src = $(item).find("img").attr("src") || "";

          const thumbnail = src.startsWith("http") ? src : BASE_WEB + src;

          const duration = $(item).find("div.movie-duration").text() || "N/A";

          return {
            slug,
            title,
            thumbnail,
            duration,
            alias,
          };
        })
        .get();

      const current = Number($("input#jump-page-input").val()) || page;

      const totalPage = Number($("input#jump-page-input").attr("max")) || 1;

      const payload = {
        results,
        current,
        totalPage,
      };

      await setCache(CACHE_KEY, payload);

      return payload;
    } catch (error) {
      console.error("Crawl error:", error);

      return {
        results: [],
        current: 0,
        totalPage: 0,
      };
    }
  },

  // Lấy phim lẻ
  getPhimLe: async (
    page: number = 1,
  ): Promise<{
    results: any[];
    totalPage: number;
    current: number;
  }> => {
    const CACHE_KEY = `movie:phim-le:${page}`;

    const cached = await getCache<{
      results: any[];
      totalPage: number;
      current: number;
    }>(CACHE_KEY);

    if (cached) return cached;

    const src =
      page === 1
        ? `${BASE_WEB}/danh-muc/phim-le`
        : `${BASE_WEB}/danh-muc/phim-le/page/${page}`;

    try {
      const { data } = await axios.get(src, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      const results = $("div.cards-grid-wrapper div.sw-item")
        .map((_, item) => {
          const title = $(item).find("h4.item-title").text().trim() || "";

          const alias = $(item).find("h4.alias-title").text().trim() || "";

          const href = $(item).find("a.v-thumbnail").attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          const src = $(item).find("img").attr("src") || "";

          const thumbnail = src.startsWith("http") ? src : BASE_WEB + src;

          const duration = $(item).find("div.movie-duration").text() || "N/A";

          return {
            slug,
            title,
            thumbnail,
            duration,
            alias,
          };
        })
        .get();

      const current = Number($("input#jump-page-input").val()) || page;

      const totalPage = Number($("input#jump-page-input").attr("max")) || 1;

      const payload = {
        results,
        current,
        totalPage,
      };

      await setCache(CACHE_KEY, payload);

      return payload;
    } catch (error) {
      console.error("Crawl error:", error);

      return {
        results: [],
        current: 0,
        totalPage: 0,
      };
    }
  },

  //Tìm kiếm
  search: async (query: string): Promise<any> => {
    if (!query || !query.trim()) return [];
    const CACHE_KEY = `movie:search:${query}`;

    const cached = await getCache<{
      results: any[];
      totalPage: number;
      current: number;
    }>(CACHE_KEY);

    if (cached) return cached;

    const src = `${BASE_WEB}/?s=${query}`;

    try {
      const { data } = await axios.get(src, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      const results = $("div.cards-grid-wrapper div.sw-item")
        .map((_, item) => {
          const title = $(item).find("h4.item-title").text().trim() || "";

          const alias = $(item).find("h4.alias-title").text().trim() || "";

          const href = $(item).find("a.v-thumbnail").attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          const src =
            $(item).find("img").attr("src") ||
            $(item).find("img").attr("srcset") ||
            "";

          const thumbnail = src.startsWith("http") ? src : BASE_WEB + src;

          const duration = $(item).find("div.movie-duration").text() || "N/A";

          return {
            slug,
            title,
            thumbnail,
            duration,
            alias,
          };
        })
        .get();

      await setCache(CACHE_KEY, results);

      return results;
    } catch (error) {
      console.error("Crawl error:", error);
      return [];
    }
  },

  //Lấy data bằng slugArr
  getBySlugArr: async (slugArr: string[]): Promise<any[]> => {
    const CHUNK_SIZE = 5;
    const results: any[] = [];

    for (let i = 0; i < slugArr.length; i += CHUNK_SIZE) {
      const chunk = slugArr.slice(i, i + CHUNK_SIZE);
      const chunkResults = await Promise.all(
        chunk.map((slug) => MovieService.getDetail(slug)),
      );
      results.push(...chunkResults);
    }

    return results.filter((item) => item !== null);
  },

  //Lấy ngẫu nhiên
  getRandom: async (): Promise<string | null> => {
    try {
      // Lấy danh sách topics và countries song song
      const [topics, countries] = await Promise.all([
        MovieService.getTopics(),
        MovieService.getCountries(),
      ]);

      const all = [...topics, ...countries];
      if (!all.length) return null;

      // Chọn ngẫu nhiên 1 category
      const randomCategory = all[Math.floor(Math.random() * all.length)];

      // Quyết định dùng getMovieByGenres hay getMovieByCountry
      const isCountry = countries.some((c) => c.slug === randomCategory.slug);

      // Lấy trang 1 để biết totalPage
      const firstPage = isCountry
        ? await MovieService.getMovieByCountry(randomCategory.slug, 1)
        : await MovieService.getMovieByGenres(randomCategory.slug, 1);

      if (!firstPage.results.length) return null;

      // Chọn ngẫu nhiên 1 trang
      const randomPage = Math.floor(Math.random() * firstPage.totalPage) + 1;

      const pageData =
        randomPage === 1
          ? firstPage
          : isCountry
            ? await MovieService.getMovieByCountry(
                randomCategory.slug,
                randomPage,
              )
            : await MovieService.getMovieByGenres(
                randomCategory.slug,
                randomPage,
              );

      if (!pageData.results.length) return null;

      // Chọn ngẫu nhiên 1 slug
      const randomMovie =
        pageData.results[Math.floor(Math.random() * pageData.results.length)];

      return randomMovie.slug ?? null;
    } catch (error) {
      console.error("getRandom error:", error);
      return null;
    }
  },
};
