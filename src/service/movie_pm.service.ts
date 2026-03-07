import { getCache, setCache } from "@/lib/redis/redis";

import axios from "axios";
import * as cheerio from "cheerio";

const BASE_WEB = "https://phimmoiz.one/";

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

      const result = $("#menu-item-2001 > ul.sub-menu > li > a")
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

      const result = $("#menu-item-2002 > ul.sub-menu > li > a")
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
    if (cached) return cached;

    try {
      const { data } = await axios.get(`${BASE_WEB}/${slug}`);
      const $ = cheerio.load(data);

      const title = $("h1.movie-title-detail").text().trim();
      const alias = $("h2.movie-original-title").text().trim();
      const image = $("div.movie-box img.thumbnail").attr("src") || null;

      const description = $("div.content-detail p")
        .map((_, el) => $(el).text().trim())
        .get()
        .join("\n");

      const episodes = $("div.episodes-grid a")
        .map((_, el) => {
          const name = $(el).text().trim();
          const href = $(el).attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          return {
            name,
            slug,
          };
        })
        .get();
      const meta: any = {};

      $(".movie-info__meta")
        .find(".meta-item, .metauscript-item") // bắt cả 2 loại class
        .each((_, el) => {
          const label = $(el)
            .find(".meta-label")
            .text()
            .replace(":", "")
            .trim();

          const valueElement = $(el).find(".meta-value");

          // Nếu có thẻ a → lấy mảng
          if (valueElement.find("a").length > 0) {
            meta[label] = valueElement
              .find("a")
              .map((_, a) => $(a).text().trim())
              .get();
          } else {
            meta[label] = valueElement.text().trim();
          }
        });

      const recommend = $("div.movies-section div.movie-item")
        .map((_, item) => {
          const title = $(item).find("h3.movie-title").text().trim() || "";

          const href = $(item).find("a.movie-link").attr("href") || "";
          const alias =
            $(item).find("div.movie-original-title").text().trim() || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          const image = $(item).find("img").attr("src");

          const duration = $(item).find("div.movie-duration").text() || "N/A";

          return {
            slug,
            title,
            image,
            duration,
            alias,
          };
        })
        .get();

      const result = {
        slug,
        image,
        title,
        alias,
        description,
        status: meta["Trạng thái"] || null,
        country: meta["Quốc gia"] || [],
        duration: meta["Thời lượng"] || null,
        quality: meta["Chất lượng"] || null,
        sub: meta["Ngôn ngữ"] || null,
        year: meta["Năm phát hành"] || null,
        director: meta["Đạo diễn"] || [],
        actors: meta["Diễn viên"] || [],
        genres: meta["Thể loại"] || [],
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
      const url = [BASE_WEB, movieSlug, epSlug].filter(Boolean).join("/");

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
          ? `${BASE_WEB}/${genreSlug}`
          : `${BASE_WEB}/${genreSlug}/page/${page}/`;

      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      const results = $("div.movies-grid div.movie-item")
        .map((_, item) => {
          const title = $(item).find("h3.movie-title").text().trim() || "";

          const alias =
            $(item).find("div.movie-original-title").text().trim() || "";

          const href = $(item).find("a.movie-link").attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          const image = $(item).find("img").attr("src");

          const duration = $(item).find("div.movie-duration").text() || "N/A";

          return {
            slug,
            title,
            image,
            duration,
            alias,
          };
        })
        .get();

      // ===== CURRENT PAGE =====
      const current = Number($("span.page-numbers.current").text()) || page;

      const totalPage = Math.max(
        1,
        ...$(".nav-links .page-numbers")
          .map((_, el) => Number($(el).text().trim()))
          .get()
          .filter((n) => !isNaN(n)),
      );
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

      const result = $(".comic-banner")
        .map((_, item) => {
          const title = $(item).find("h3.comic-title").text().trim();

          const href = $(item).find("a.movie-link").attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;

          const image = $(item).find("img").attr("src") || "";

          return {
            slug,
            title,
            image,
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
        ? `${BASE_WEB}/country/${countrySlug}`
        : `${BASE_WEB}/country/${countrySlug}/page/${page}`;

    try {
      const { data } = await axios.get(src, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      const results = $("div.movies-grid div.movie-item")
        .map((_, item) => {
          const title = $(item).find("h3.movie-title").text().trim() || "";

          const href = $(item).find("a.movie-link").attr("href") || "";
          const alias =
            $(item).find("div.movie-original-title").text().trim() || "";
          const slug = href.split("/").filter(Boolean).pop() || null;

          const image = $(item).find("img").attr("src");

          const duration = $(item).find("div.movie-duration").text() || "N/A";

          return {
            slug,
            title,
            image,
            duration,
            alias,
          };
        })
        .get();

      const current = Number($("span.page-numbers.current").text()) || page;

      const totalPage = Math.max(
        1,
        ...$(".nav-links .page-numbers")
          .map((_, el) => Number($(el).text().trim()))
          .get()
          .filter((n) => !isNaN(n)),
      );

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

      const results = $("div.movies-grid div.movie-item")
        .map((_, item) => {
          const title = $(item).find("h3.movie-title").text().trim() || "";

          const href = $(item).find("a.movie-link").attr("href") || "";

          const slug = href.split("/").filter(Boolean).pop() || null;
          const alias =
            $(item).find("div.movie-original-title").text().trim() || "";

          const image = $(item).find("img").attr("src");

          const duration = $(item).find("div.movie-duration").text() || "N/A";

          return {
            slug,
            title,
            image,
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
