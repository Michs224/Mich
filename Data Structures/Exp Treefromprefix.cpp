#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#include <stdlib.h>
typedef struct _btnode {
   int item;
   struct _btnode *left;
   struct _btnode *right;
} BTNode;

void createExpTree(BTNode **root, char *prefix) {
   *root = (BTNode*)malloc(sizeof(BTNode));
   char *token = strtok(prefix, " ");    // set string prefix, delimited by spaces, to be tokenized
   if( isdigit(token[0]) ) {             // external nodes (= leaves) are operands
       (*root)->item = atoi(token);
       (*root)->left = NULL;
       (*root)->right = NULL;
   }
   else {                                // internal nodes are binary operators
       (*root)->item = token[0];
       createExpTree(&(*root)->left, NULL);  // continue using the same string prefix
       createExpTree(&(*root)->right, NULL); // continue using the same string prefix
   }
}

void printTree(BTNode *node){
   if( node == NULL ) return;
   if( node->left == NULL && node->right == NULL )  // external node
       printf("%d", node->item);
   else {                                           // internal node
       printf("(");
       printTree(node->left);
       printf(" %c ", (char)node->item);
       printTree(node->right);
       printf(")");
   }
}

void printTreePostfix(BTNode *node){
   if( node == NULL ) return;
   printTreePostfix(node->left);
   printTreePostfix(node->right);
   if(node->left ==NULL && node->right == NULL)  // external node
      printf("%d ",node->item);
   else                                          // internal node
      printf("%c ",(char)(node->item));
}

int main(void) {
   BTNode *root1;
   char prefix1[513] = "* + 1 2 - 3 4";
   createExpTree(&root1, prefix1);
   printf("Infix Tree:   ");
   printTree(root1);
   printf("\nPostfix Tree: ");
   printTreePostfix(root1);
   puts("");

   BTNode *root2;
   char prefix2[513] = "+ 99 / + 88 77 - * 66 - 55 44 33";
   createExpTree(&root2, prefix2);
   printf("Infix Tree:   ");
   printTree(root2);
   printf("\nPostfix Tree: ");
   printTreePostfix(root2);
   puts("");
   return 0;
}
