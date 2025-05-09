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
    <!-- Tabs Navigation For proof of concep. Static-->
    <div class="tabs header-buttons center-align padding">
        <div class="header-tabs">
          <a href="javascript:void(0)" class="chip {activeTab === 0 ? 'active' : ''} " on:click={() => activeTab = 0}
            on:keydown={(event) => handleKeydown(event, 0)} tabindex="0">
            Jan
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 1 ? 'active' : ''} " on:click={() => activeTab = 1}
            on:keydown={(event) => handleKeydown(event, 1)} tabindex="0">
            Feb
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 2 ? 'active' : ''} " on:click={() => activeTab = 2}
            on:keydown={(event) => handleKeydown(event, 2)} tabindex="0">
            Mar
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 3 ? 'active' : ''} " on:click={() => activeTab = 3}
            on:keydown={(event) => handleKeydown(event, 3)} tabindex="0">
            April
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 4 ? 'active' : ''} " on:click={() => activeTab = 4}
            on:keydown={(event) => handleKeydown(event, 4)} tabindex="0">
            May
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 5 ? 'active' : ''} " on:click={() => activeTab = 5}
            on:keydown={(event) => handleKeydown(event, 5)} tabindex="0">
            June
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 6 ? 'active' : ''} " on:click={() => activeTab = 6}
            on:keydown={(event) => handleKeydown(event, 6)} tabindex="0">
            July
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 7 ? 'active' : ''} " on:click={() => activeTab = 7}
            on:keydown={(event) => handleKeydown(event, 7)} tabindex="0">
            Aug
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 8 ? 'active' : ''} " on:click={() => activeTab = 8}
            on:keydown={(event) => handleKeydown(event, 8)} tabindex="0">
            Sept
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 9 ? 'active' : ''} " on:click={() => activeTab = 9}
            on:keydown={(event) => handleKeydown(event, 9)} tabindex="0">
            Oct
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 10 ? 'active' : ''} " on:click={() => activeTab = 10}
            on:keydown={(event) => handleKeydown(event, 10)} tabindex="0">
            Nov
          </a>
          <a href="javascript:void(0)" class="chip {activeTab === 11 ? 'active' : ''} " on:click={() => activeTab = 11}
            on:keydown={(event) => handleKeydown(event, 11)} tabindex="0">
            Dec
          </a>

          <!-- Search Placeholder ? or date picker, idk-->
          <div class="field small prefix round fill">
            <i class="front">search</i>
            <input>
          </div>
        </div>
      </div>

        <div>
          <!-- Tab Content For proof of concept -->
          <div class="page padding {activeTab === 0 ? 'active' : ''}">
            <table class="stripes">
              <thead>
                <tr>
                  <th>2024-1-12</th> 
                </tr>
                <tr>
                  <th>Type </th>
                  <th>Starts </th>
                  <th>Ends </th>
                  <th>Duration </th>
                  <th>Remarks </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024-1-12</td>
                  <td>Clock In</td>
                  <td>2024-1-12 06:11:59.527</td>
                  <td>- </td>
                  <td>- </td>
                  <td>- </td>
                </tr>
                <tr>
                  <td>2024-1-12</td>
                  <td>Break</td>
                  <td>2024-1-12 06:11:59.527</td>
                  <td>2024-1-1206:11:59.527</td>
                  <td>0:14:56</td>
                  <td>- </td>
                </tr>
                <tr>
                  <td>2024-1-12</td>
                  <td>Coaching</td>
                  <td>2024-1-12 06:11:59.527</td>
                  <td>2024-1-12 06:11:59.527</td>
                  <td>0:30:00</td>
                  <td>- 121 with Liam </td>
                </tr>
                <tr>
                  <td>2024-1-12</td>
                  <td>Lunch</td>
                  <td>2024-1-12 06:11:59.527</td>
                  <td>2024-1-12 06:11:59.527</td>
                  <td>0:56:43</td>
                  <td>- Had a great lunch </td>
                </tr>
                
            </table>
          </div>
          <div class="page padding {activeTab === 1 ? 'active' : ''}">
            <h5>Feb Content</h5>
          </div>
          <div class="page padding {activeTab === 2 ? 'active' : ''}">
            <h5>March Content</h5>
          </div>
          <div class="page padding {activeTab === 3 ? 'active' : ''}">
            <h5>April Content</h5>
          </div>
          <div class="page padding {activeTab === 4 ? 'active' : ''}">
            <h5>May Content</h5>
          </div>
          <div class="page padding {activeTab === 5 ? 'active' : ''}">
            <h5>June Content</h5>
          </div>
          <div class="page padding {activeTab === 6 ? 'active' : ''}">
            <h5>July Content</h5>
          </div>
          <div class="page padding {activeTab === 7 ? 'active' : ''}">
            <h5>August Content</h5>
          </div>
          <div class="page padding {activeTab === 8 ? 'active' : ''}">
            <h5>September Content</h5>
          </div>
          <div class="page padding {activeTab === 9 ? 'active' : ''}">
            <h5>October Content</h5>
          </div>
          <div class="page padding {activeTab === 10 ? 'active' : ''}">
            <h5>November Content</h5>
          </div>
          <div class="page padding {activeTab === 11 ? 'active' : ''}">
            <h5>December Content</h5>
          </div>
        </div>
  </div>
</article>

