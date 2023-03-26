#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
//+1*+642
struct btnode{
	char data;
	struct btnode*left;
	struct btnode*right;
};

int count=0;

void createExpTree(struct btnode **root, char* prefix){
//	printf("%d %c\n",count,prefix[count]);
//	prefix=prefix+1;
	char c=prefix[count];
	if(c==NULL){
		return;
	}
	if(c==' '){
		count++;
		c = prefix[count];	
	}

	if(c=='+' || c=='-' || c=='*' || c=='/' || c=='%'){
		btnode *newnode=(struct btnode*)malloc(sizeof(struct btnode));
//		*root=(struct btnode*)malloc(sizeof(struct btnode));
		newnode->data=c;
		*root=newnode;
//		(*root)->data=c;
//		printf("%cY",(*root)->data);
		count++;
//		printf("%d\n",count);
		createExpTree(&(*root)->left,prefix);
		createExpTree(&(*root)->right,prefix);
	}
//	else(c>='a' && c<='z' || c>='A' && c<='Z' || c>='0' && c<='9'){
	else {
		btnode *newnode=(struct btnode*)malloc(sizeof(struct btnode*));
//		*root=(struct btnode*)malloc(sizeof(struct btnode));
		newnode->data=c;
		newnode->left=NULL;
		newnode->right=NULL;
//		(*root)->data=c;
//		(*root)->left=NULL;
//		(*root)->right=NULL;
		*root=newnode;
		count++;
//		printf("%d\n",count);
//		printf("%cx",(*root)->data);

	}
}
	


void prefixx(struct btnode *root){
//		struct btnode *ptr=root;
		printf("%c",root->data);
		if(root->left != 0) prefixx(root->left);
		if(root->right != 0) prefixx(root->right);
	
}

void infix(struct btnode *root){
		if(root->data =='+' || root->data =='-' || root->data =='*' || root->data =='/' ||  root->data =='%') printf("(");
		if(root->left != 0) infix(root->left);
		printf("%c",root->data);
		if(root->right != 0) infix(root->right);
		if(root->data =='+' || root->data =='-' || root->data =='*' || root->data =='/' ||  root->data =='%') printf(")");
//		printf(")");
}

void postfix(struct btnode*root){

		if(root->left != 0) postfix(root->left);
		if(root->right != 0) postfix(root->right);
		printf("%c",root->data);
	
}

int main(){
	btnode *root=NULL;
	char prefix[1001]={NULL};
	printf("Masukkan  Prefix Expression: ");
	scanf("%[^\n]",prefix);
	printf("%s\n",prefix);
	createExpTree(&root,prefix);
	printf("Prefix Expression: ");
	prefixx(root);
	printf("\n");
	printf("Infix Expression: ");
	infix(root);
	printf("\n");
	printf("Postfix Expression: ");
	postfix(root);
	printf("\n");
	
	return 0;
}
