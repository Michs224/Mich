#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
//+1*+642
struct btnode{
	int data;
	char datas[];
	struct btnode*left;
	struct btnode*right;
};

int count=0;

void createExpTree(struct btnode **root, char* prefix){

char *token=strtok(prefix," ");
	if(token==NULL){
		return;
	}

	if(token[0]=='+' || token[0]=='-' || token[0]=='*' || token[0]=='/' || token[0]=='%'){
		btnode *newnode=(struct btnode*)malloc(sizeof(struct btnode));
//		*root=(struct btnode*)malloc(sizeof(struct btnode));
		newnode->data=token[0];
		*root=newnode;
		createExpTree(&(*root)->left,NULL);
		createExpTree(&(*root)->right,NULL);
	}
//	else(c>='a' && c<='z' || c>='A' && c<='Z' || c>='0' && c<='9'){
	else {
		btnode *newnode=(struct btnode*)malloc(sizeof(struct btnode*));
		if(isdigit(token[0])){
			newnode->data=atoi(token);
			newnode->left=NULL;
			newnode->right=NULL;
		}
		else{
			strcpy(newnode->datas,token);
			puts(newnode->datas);
			newnode->left=NULL;
			newnode->right=NULL;
		}
		*root=newnode;

	}
}
	


void prefixx(struct btnode *root){
//		struct btnode *ptr=root;
	if(root->left==NULL && root->right==NULL){
		if(root->data>=0 && root->datas[0]==NULL){
			printf("%d ",root->data);
		}
		else printf("%s ",root->datas);
	}
	else printf("%c ",root->data);
		if(root->left != 0) prefixx(root->left);
		if(root->right != 0) prefixx(root->right);
	
}

void infix(struct btnode *root){
		if(root->data =='+' || root->data =='-' || root->data =='*' || root->data =='/' ||  root->data =='%') printf("(");
		if(root->left != 0) infix(root->left);
		
		if(root->left==NULL && root->right==NULL){
			if(root->data>=0 && root->datas[0]==NULL){
			printf("%d ",root->data);
			}
			else printf("%s ",root->datas);
			}
		else printf("%c ",root->data);
		
		if(root->right != 0) infix(root->right);
		if(root->data =='+' || root->data =='-' || root->data =='*' || root->data =='/' ||  root->data =='%') printf(")");
//		printf(")");
}

void postfix(struct btnode*root){

		if(root->left != 0) postfix(root->left);
		if(root->right != 0) postfix(root->right);
		
		if(root->left==NULL && root->right==NULL){
			if(root->data>=0 && root->datas[0]==NULL){
			printf("%d ",root->data);
			}
			else printf("%s ",root->datas);
		}
		else printf("%c ",root->data);
	
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
