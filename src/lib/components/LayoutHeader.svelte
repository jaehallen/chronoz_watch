<script lang="ts">
  import type { AppPages } from '$lib/app-types';

  let { currentPage = { href: '/profile', title: 'Profile' }, routes, user } = $props();
</script>

{#snippet appRoute(route: AppPages)}
  <a href={route.href}>
    <i>{route.icon}</i>
    <div>
      {route.title}
      {#if currentPage.href === route.href}
        <hr class="small-elevate primary" />
      {/if}
    </div>
  </a>
{/snippet}

<nav class="m l left">
  <header>
    <img class="circle" src="/logo.png" alt="chronoz" />
  </header>
  {#each routes as route}
    {@render appRoute(route)}
  {/each}
</nav>
<header class="fixed responsive max small-elevate">
  <nav>
    <h6 class="max">{currentPage.title}</h6>
    <h6>{user.name}</h6>
    <button class="circle transparent">
      <img class="responsive" src="/logo.png" alt="avatar" />
      <menu class="no-wrap left border">
        <li>
          <a href="/profile">
            <ul class="list border larg-">
              <li>
                <i>account_circle</i>
                <div class="max">
                  <h6 class="small">{user.name}</h6>
                  <span class="capitalize">{user.role}</span>
                </div>
              </li>
            </ul>
          </a>
        </li>
        <li class="right-align">
          <form action="/api/logout" method="POST">
            <i class="link">logout</i>
            <input class="button transparent no-padding" type="submit" value="Logout"/>
          </form>
        </li>
      </menu>
    </button>
  </nav>
</header>
