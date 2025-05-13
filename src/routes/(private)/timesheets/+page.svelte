<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  function showDialog() {
      const dialog = document.getElementById('confirmation-dialog');
      dialog?.showModal();  
  }

  function closeDialog() {
      const dialog = document.getElementById('confirmation-dialog');
      dialog?.close();
  }

  function confirmAction() {
      closeDialog();
  }
</script>

<article class="large-margin">
  <div>
      <div class="tabs header-buttons center-align padding">
          <nav class="no-space responsive">
              <button class="border left-round max" on:click={showDialog}>
                  <i>timer_off</i>
                  <span>Break</span>
              </button>
              <button class="border no-round max" on:click={showDialog}>
                  <i>restaurant</i>
                  <span>Lunch</span>
              </button>
              <button class="border no-round max" on:click={showDialog}>
                  <i>restaurant</i>
                  <span>Bio</span>
              </button>
              <button class="border no-round max" on:click={showDialog}>
                  <i>coffee</i>
                  <span>Coffee</span>
              </button>
              <button class="border no-round max" on:click={showDialog}>
                  <i>sports</i>
                  <span>Coaching</span>
              </button>
              <button class="border no-round max" on:click={showDialog}>
                  <i>timer_off</i>
                  <span>Meeting</span>
              </button>
              <button class="border right-round max" on:click={showDialog}>
                  <i>surgical</i>
                  <span>Clinic</span>
              </button>
          </nav>
      </div>

      <!-- Static table for proof of concept -->
      <table class="stripes">
          <thead>
              <tr>
                  <th>Date</th>
                  <th>Type </th>
                  <th>Starts </th>
                  <th>Ends </th>
                  <th>Duration </th>
                  <th>Remarks </th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>2024-12-12</td>
                  <td>Clock In</td>
                  <td>2024-12-12 06:11:59.527</td>
                  <td>- </td>
                  <td>- </td>
                  <td>- </td>
              </tr>
              <tr>
                  <td>2024-12-12</td>
                  <td>Break</td>
                  <td>2024-12-12 06:11:59.527</td>
                  <td>2024-12-12 06:11:59.527</td>
                  <td>0:14:56</td>
                  <td>- </td>
              </tr>
              <tr>
                  <td>2024-12-12</td>
                  <td>Coaching</td>
                  <td>2024-12-12 06:11:59.527</td>
                  <td>2024-12-12 06:11:59.527</td>
                  <td>0:30:00</td>
                  <td>- 121 with Liam </td>
              </tr>
              <tr>
                  <td>2024-12-12</td>
                  <td>Lunch</td>
                  <td>2024-12-12 06:11:59.527</td>
                  <td>2024-12-12 06:11:59.527</td>
                  <td>0:56:43</td>
                  <td>- Had a great lunch </td>
              </tr>
              <tr>
                  <td>2024-12-12</td>
                  <td>Break</td>
                  <td>2024-12-12 06:11:59.527</td>
                  <td>2024-12-12 06:11:59.527</td>
                  <td>0:14:56</td>
                  <td>- Got rained on 😒</td>
              </tr>
          </table>
      </div>
  </article>

  <!-- Dialog HTML -->
  <dialog id="confirmation-dialog" class="primary-border">
      <h5>Are you sure?</h5>
      <div class="field textarea label border ">
        <textarea></textarea>
        <label>Enter Remarks (Optional): </label>
      </div>
      <nav class="right-align no-space">
          <button class="transparent link" on:click={closeDialog}>Cancel</button>
          <button class="transparent link" on:click={confirmAction}>Confirm</button>
      </nav>
  </dialog>
