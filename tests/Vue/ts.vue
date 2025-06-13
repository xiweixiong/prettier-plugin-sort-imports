<script lang="ts">
// I am top level comment in this file.
import z from 'z';
import { clone } from 'lodash'
import threeLevelRelativePath from "../../../threeLevelRelativePath";
import sameLevelRelativePath from "./sameLevelRelativePath";
import thirdParty from "third-party";
import oneLevelRelativePath from "../oneLevelRelativePath";
import otherthing from "@core/otherthing";
import abc from "@core/abc";
import twoLevelRelativePath from "../../twoLevelRelativePath";
import component from "@ui/hello";
import fourLevelRelativePath from "../../../../fourLevelRelativePath";
import something from "@server/something";
import xyz from "@ui/xyz";
import { ref, defineComponent  } from 'vue';

function add(a,b) {
  return a + b;
}

export default defineComponent({
  setup() {
    const value = ref()
    const valueb = clone(value)
    return {
      value
    }
  }
})
</script>
