const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const LOGIN_DATA = { username: 'dev-admin', password: 'DevAdmin123' };

const posts = [
  {
    title: 'Building Scalable Microservices with NestJS',
    desc: 'A comprehensive guide to building robust, scalable microservices using NestJS framework with real-world examples and best practices.',
    content:
      'Microservices architecture has become the cornerstone of modern application development, offering unparalleled scalability and maintainability. NestJS, with its powerful decorators and dependency injection system, provides an excellent foundation for building microservices that can handle enterprise-level demands.',
    tags: ['Backend', 'Full stack', 'OpenSource'],
  },
  {
    title: 'Mastering React Performance Optimization',
    desc: 'Deep dive into React performance optimization techniques, from basic memoization to advanced rendering strategies that will make your applications lightning fast.',
    content:
      "React performance optimization is both an art and a science, requiring deep understanding of the framework's rendering mechanism and the browser's rendering pipeline. Modern web applications demand exceptional performance, and React provides numerous tools to achieve this goal.",
    tags: ['Frontend', 'Career', 'Full stack'],
  },
  {
    title: "The Future of Web Development: What's Next?",
    desc: 'Exploring emerging technologies and trends that will shape the future of web development, from AI integration to new frameworks and development paradigms.',
    content:
      'The web development landscape is evolving at an unprecedented pace, driven by technological advancements and changing user expectations. Understanding these trends is crucial for developers who want to stay ahead of the curve.',
    tags: ['Frontend', 'Backend', 'Career'],
  },
  {
    title: "Contributing to Open Source: A Developer's Guide",
    desc: 'A comprehensive guide for developers who want to start contributing to open source projects, from finding the right project to making your first pull request.',
    content:
      "Contributing to open source is one of the most rewarding experiences a developer can have. It's an opportunity to work on real-world projects, learn from experienced developers, and give back to the community.",
    tags: ['OpenSource', 'Career', 'Full stack'],
  },
  {
    title: 'API Design Best Practices for Modern Applications',
    desc: 'Comprehensive guide to designing robust, scalable, and user-friendly APIs that developers will love to use and maintain.',
    content:
      'API design is a critical aspect of modern software development that directly impacts the success of your applications. A well-designed API can accelerate development, reduce maintenance costs, and provide a better experience.',
    tags: ['Backend', 'Full stack', 'OpenSource'],
  },
  {
    title: 'State Management in Large React Applications',
    desc: 'Deep dive into state management strategies for complex React applications, covering everything from local state to global state management solutions.',
    content:
      'State management is one of the most challenging aspects of building large React applications. As applications grow in complexity, managing state effectively becomes crucial for maintaining code quality and performance.',
    tags: ['Frontend', 'Full stack', 'Career'],
  },
  {
    title: 'Database Design Patterns for Scalable Systems',
    desc: 'Exploring advanced database design patterns and strategies for building scalable, high-performance systems that can handle millions of users.',
    content:
      'Database design is a critical component of any scalable system, and the choices you make early in the development process can have long-lasting implications for performance, maintainability, and cost.',
    tags: ['Backend', 'Career', 'OpenSource'],
  },
  {
    title: 'Building Accessible Web Applications',
    desc: 'Comprehensive guide to creating web applications that are accessible to all users, including those with disabilities, and why accessibility should be a priority.',
    content:
      "Web accessibility is not just a legal requirement or a nice-to-have feature—it's a fundamental aspect of creating inclusive digital experiences that work for everyone.",
    tags: ['Frontend', 'Career', 'OpenSource'],
  },
  {
    title: 'DevOps Practices for Modern Development Teams',
    desc: 'Essential DevOps practices and tools that every development team should implement to streamline development, deployment, and operations.',
    content:
      'DevOps has evolved from a buzzword to a fundamental approach that bridges the gap between development and operations, enabling teams to deliver software faster and more reliably.',
    tags: ['Backend', 'Full stack', 'Career'],
  },
  {
    title: 'The Art of Code Review: Best Practices',
    desc: 'Mastering the art of code review to improve code quality, share knowledge, and build stronger development teams through effective collaboration.',
    content:
      'Code review is one of the most important practices in software development, serving as a quality gate, knowledge sharing mechanism, and team building exercise.',
    tags: ['OpenSource', 'Career', 'Full stack'],
  },
];

async function login() {
  try {
    console.log('Logging in as dev-admin...');
    const response = await axios.post(`${BASE_URL}/auth/login`, LOGIN_DATA);
    return response.data.access_token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function createPost(token, post) {
  try {
    console.log(`Creating post: ${post.title}`);
    const response = await axios.post(`${BASE_URL}/posts`, post, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ Created post: ${post.title}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Failed to create post "${post.title}":`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function createAllPosts() {
  try {
    console.log('🚀 Starting post creation process...\n');

    const token = await login();
    console.log('✅ Login successful\n');

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      console.log(`📝 Creating post ${i + 1}/${posts.length}`);
      await createPost(token, post);
      console.log('');

      if (i < posts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log('🎉 All posts created successfully!');

    const tagCounts = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    console.log('📊 Tag distribution:');
    Object.entries(tagCounts).forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count} posts`);
    });
  } catch (error) {
    console.error('💥 Error during post creation:', error.message);
    process.exit(1);
  }
}

createAllPosts();
