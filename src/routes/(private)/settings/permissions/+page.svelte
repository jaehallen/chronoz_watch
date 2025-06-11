<script lang="ts">
  import type { PageData, SubmitFunction } from "./$types";
  import {enhance, applyAction} from "$app/forms"

  let { data }: { data: PageData } = $props();

  const formOptions: SubmitFunction = () => {
    return async ({ result}) => {
      if (result.type === "success" && result.data) {
        const {permissions } = result.data;

        console.log(permissions)

      }else if (result.type === "error"){
        console.error(result.error)
      }
    }
  }
</script>

<section class="responsive">
  <article class="margin">
    {#if data.roles}
      <form method="POST" action="?/get-permissions" use:enhance={formOptions}>
        <fieldset>
          <legend>Roles Permissions</legend>
          <div class="row">
            <div class="max">
              <nav class="no-space">
                <div class="field prefix border small left-round">
                  <i>arrow_drop_down</i>
                  <select name="role_id">
                    {#each data.roles as role (role.id)}
                      <option value={role.id}>{role.name}</option>
                    {/each}
                  </select>
                </div>
                <button type="submit" class="right-round">
                  <i>read_more</i>
                </button>
              </nav>
            </div>
            <div class="max">
            </div>
            <nav class="no-space">
              <button class="border left-round small">
                <i>add</i>
              </button>
              <button class="border no-round small">
                <i>save</i>
              </button>
              <button class="border right-round small">
                <i>delete_sweep</i>
              </button>
            </nav>
          </div>
        </fieldset>
      </form>
    {/if}
  </article>
</section>
