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
    <div class="tabs left-align padding">
      <button class="active">
        <span>Select Year</span>
        <i>arrow_drop_down</i>
        <menu class="active">
          <li>Item</li>
          <li>2024
            <menu>
              <li>January</li>
              <li>March</li>
              <li>December</li>
            </menu>
          <li>2025
            <menu>
              <li>December</li>
              <li>Library</li>
              <li>Basketball</li>
            </menu>
          </li>
        </menu>
      </button>
        
    </div>
    
        <div>
          <!-- Tab Content For proof of concept -->
          <div class="page padding {activeTab === 0 ? 'active' : ''}">
            <div class="field small prefix round fill">
              <i class="front">search</i>
              <input>
            </div>
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

