export default class JSXHelper {
   static hasScrolledToBottom(elementId: string): boolean {
      const element = document.getElementById(`${elementId}`);
      if (element) {
         const { scrollTop, scrollHeight, clientHeight } = element;
         const reachedBottomOfDiv = scrollTop + clientHeight >= scrollHeight;
         return reachedBottomOfDiv;
      }
      console.error(`Internal Error: No element with Id: ${elementId} found.`);
      return false;
   }
}
