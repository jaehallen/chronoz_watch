<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    //Test data
    let isFilled = {break: false, lunch: false, bio: false, coffee: false, coaching: false, meeting: false, clinic: false, };

  function toggleFill(button: 'break' | 'lunch' | 'bio' | 'coffee' | 'coaching' | 'meeting' | 'clinic') {
    isFilled[button] = !isFilled[button];
  }
</script>

<article class="large-margin">
    <div>
      <!-- Static for now because no idea if this is modular -->
      <div class="tabs header-buttons center-align padding">
        <nav class="no-space responsive">
          <button class="border left-round max {isFilled.break ? 'fill' : ''}" on:click={() => toggleFill('break')}>
            <i>timer_off</i>
            <span>Break</span>
          </button>
          <button class="border no-round max {isFilled.lunch ? 'fill' : ''}" on:click={() => toggleFill('lunch')}>
            <i>restaurant</i>
            <span>Lunch</span>
          </button>
          <button class="border no-round max {isFilled.bio ? 'fill' : ''}" on:click={() => toggleFill('bio')}>
            <i>restaurant</i>
            <span>Bio</span>
          </button>
          <button class="border no-round max {isFilled.coffee ? 'fill' : ''}" on:click={() => toggleFill('coffee')}>
            <i>coffee</i>
            <span>Coffee</span>
          </button>
          <button class="border no-round max {isFilled.coaching ? 'fill' : ''}" on:click={() => toggleFill('coaching')}>
            <i>sports</i>
            <span>Coaching</span>
          </button>
          <button class="border no-round max {isFilled.meeting ? 'fill' : ''}" on:click={() => toggleFill('meeting')}>
            <i>timer_off</i>
            <span>Meeting</span>
          </button>
          <button class="border right-round max {isFilled.clinic ? 'fill' : ''}" on:click={() => toggleFill('clinic')}>
            <i>surgical</i>
            <span>Clinic</span>
          </button>
        </nav>
      </div>
  
      <!-- Insert Timer here? -->
  
      
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
  
