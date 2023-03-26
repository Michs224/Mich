#include <stdio.h>
#include <stdlib.h>

struct node{
	int data;
	struct node *left;
	struct node *right;
};


struct node *search(struct node *tree,int val){
	if(tree==NULL || tree->data==val){
		return tree;
	}
	
	if (val < tree->data){
		return search(tree->left,val);
	}
	else{
		return search(tree->right,val);
		
	}
	
	
}

struct node *insert(struct node *tree,int val){
//	node* newnode=(struct node*)malloc(sizeof(struct node));
//	newnode->data=val;
//	newnode->left=NULL;
//	newnode->right=NULL;
	if(tree==NULL){
		tree=(struct node*)malloc(sizeof(struct node));
		tree->data=val;
		tree->left=NULL;
		tree->right=NULL;
	}
	else{
		if(val<tree->data){
			tree->left= insert(tree->left,val);
		}
		else tree->right = insert(tree->right,val);
		
	}
	return tree;
}

void Preorder(struct node *tree){
	if(tree!=NULL){
		printf("%d ",tree->data);
		Preorder(tree->left);
		Preorder(tree->right);
	}
}

void Inorder(struct node *tree){
	if(tree!=NULL){
		Inorder(tree->left);
		printf("%d ",tree->data);
		Inorder(tree->right);
	}
}

void Postorder(struct node *tree){
	if(tree!=NULL){
		Postorder(tree->left);
		Postorder(tree->right);
		printf("%d ",tree->data);
	}
}

struct node *deletee(struct node *tree){
	
}

int main(){
	node *tree=NULL;
	node *ptr;
	int choose,val;
	system("cls");
	do{
		system("cls");
		printf("Menu:\n");
		printf("1. Search\n2. Insert Element\n3. Preorder Traversal\n4. Inorder Traversal\n5. Postfix Traversal\n6. Delete Element\n7. Exit\n>> "); scanf("%d",&choose);
		switch(choose){
			case 1:{
				printf("Masukkan Element yang ingin dicari: "); scanf("%d",&val);
				ptr=search(tree,val);
				if(ptr==NULL){
					printf("Element yang dicari tidak ada\n");
				}
				else printf("Ada, Element yang dicari: %d\n",ptr->data);
				system("pause");
				break;
			}
			
			
			case 2:{
				printf("Insert the element: "); scanf("%d",&val);
				tree=insert(tree,val);
//				system("cls");
				break;
			}
			
			case 3:{
				Preorder(tree);
				puts("");
				system("pause");
//				system("cls");
				break;
			}
			
			case 4:{
				Inorder(tree);
				puts("");
				system("pause");
//				system("cls");
				break;
			}
			
			case 5:{
				Postorder(tree);
				puts("");
				system("pause");
//				system("cls");
				break;
			}
			
//			case 6:{
//				printf("Masukkan elemen yang ingin dihapus: "); scanf("%d",&val);
//				tree=deletee(tree,val);
//				break;
//			}
			
			default:{
				printf("Invalid Option, please input again!\n");
				system("pause");
				break;
			}
		}
		
	}while(choose !=7);
	
}
