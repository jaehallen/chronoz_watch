<script lang="ts">
  import type { PageData } from './$types';

  let activeTab = 0;

  function handleKeydown(event: KeyboardEvent, tabIndex: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      activeTab = tabIndex;
    }
  }
</script>

<article class="large-margin">
  <div>
    <!-- Tabs Navigation For proof of concept-->
    <div class="tabs header-buttons center-align padding">
      <div>
        <div class="header-tabs">
          <button class={activeTab === 0 ? 'active' : ''}
            on:click={() => activeTab = 0}
            on:keydown={(event) => handleKeydown(event, 0)}
            tabindex="0">
            Tab 1
          </button>
          <button
            class={activeTab === 1 ? 'active' : ''}
            on:click={() => activeTab = 1}
            on:keydown={(event) => handleKeydown(event, 1)}
            tabindex="0">
            Tab 2
          </button>
          <button
            class={activeTab === 2 ? 'active' : ''}
            on:click={() => activeTab = 2}
            on:keydown={(event) => handleKeydown(event, 2)}
            tabindex="0">
            Tab 3
          </button>
        </div>

        <!-- Tab Content For proof of concept -->
        <div class="page padding {activeTab === 0 ? 'active' : ''}">
          <h5>Tab 1 Content</h5>
        </div>
        <div class="page padding {activeTab === 1 ? 'active' : ''}">
          <h5>Tab 2 Content</h5>
        </div>
        <div class="page padding {activeTab === 2 ? 'active' : ''}">
          <h5>Tab 3 Content</h5>
        </div>
      </div>
    </div>
  </div>
</article>

