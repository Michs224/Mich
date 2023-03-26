#include <stdio.h>
#include <stdlib.h>

struct node{
	int data;
	struct node*left;
	struct node*right;
};

struct node *newnode(int data){
	struct node*temp=(struct node*)malloc(sizeof(struct node));
	temp->data=data;
	temp->left=NULL;
	temp->right=NULL;
	
	return temp;
}

void displayPrefix(struct node *node){
	if(node==NULL) return;
	
	printf("%d ",node->data);
	displayPrefix(node->left);
	displayPrefix(node->right);
	
//	exit(0);
}

void displayInfix(struct node *node){
	if(node==NULL) return;
	
	displayInfix(node->left);
	printf("%d ",node->data);
	displayInfix(node->right);
}

void displayPostfix(struct node *node){
	if(node==NULL) return;
	
	displayPostfix(node->left);
	displayPostfix(node->right);
	printf("%d ",node->data);
}


int main(){
	struct node *root=newnode(18);
	root->left=newnode(16);
	root->right=newnode(5);
	root->left->left=newnode(3);
	
	displayPrefix(root);
	puts("");
	displayInfix(root);
	puts("");
	displayPostfix(root);
	puts("");
	return 0;
}
