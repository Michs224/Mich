#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

struct hastTable{
	char name[100];
	struct hastTable *next;
};
hastTable *ht[26]={NULL};
//hastTable *tampung[26];

int hashKey(char value[])
{	int count=0;
	char str[30];
//	int k[30];
		for(int i=0;i<strlen(value);i++){
			count+=value[i];
		}
	int k=count*count;
	itoa(k,str,10);
//	printf("%s\n%s\n",str,k);
	if(strlen(str)<3){
//		printf("%d\n",atoi(str));
		return atoi(str);
	}
	
	else if(strlen(str)%2==1){
		char tamp[3];
		int x=-1;
		for(int i=0;i<3;i++){
			int n=strlen(str);
			tamp[i]=str[(n/2)-x];
			x++;
		}		
		int key=0;
		if(atoi(tamp)>25){
			key=atoi(tamp)%26;
		}
		return key;
	}
	
	else if (strlen(str)%2==0){
		char tamp[2];
		int x=-1;
		for(int i=0;i<2;i++){
			int n=strlen(str);
			tamp[i]=str[(n/2)+x];
			x++;
		}
		int key=0;
		if(atoi(tamp)>25){
			key=atoi(tamp)%26;
		}
		return key;
//		printf("%d\n",atoi(tamp));
	}
	

//	printf("%d ",count);
//    printf("%d ",tolower(value[0]) - 'a');
}

void insert(int key, char value[])
{
    hastTable* newptr = (struct hastTable*)malloc(sizeof(struct hastTable));
//    if (newptr == NULL)
//    {
//        return;
//    }

    strcpy(newptr->name, value);
    newptr->next = NULL;


    if (ht[key] == NULL)
    {
       ht[key] = newptr;
    }
 
    else
    {
    	
        hastTable* predptr = ht[key];
//	    tampung=ht;
//        int keykey=key;
//        int check=0;
// 		key=0;
//        while(predptr!=NULL){
//        	if (strcmp(newptr->name,ht[key]->name)==0){
//        		ht[key]->next=newptr;
////       		ht[key]->next->next=NULL;
//        		break;
//			}
//        	else{
//        		check=1;
//			}
//			key++;
//		}
//		if(check==1){
//			ht[keykey]=newptr;
//		}
        while (true)
        {
            if (predptr->next == NULL)
            {
                predptr->next = newptr;
                break;
            }

            predptr = predptr->next;
        }
    }
}

void display(struct hastTable *ht[]){
//	struct hastTable *display=*ht;
	if(display==NULL){
		printf("HAST TABLE IS EMPTY\n");
		return;
	}
	int i=0;
	
	while(i<26){
		struct hastTable *display=ht[i];
//		struct hastTable *tamp=display;
		printf("H[%d]: ",i);
		while(display!=NULL){
			printf("%s ",display->name);
			display=display->next;
		}
//		printf("%s ",display->name);
		printf("\n");
		i++;
	}
//	*ht=*display;
}

int main(){	int x;
	char value[100];
	do{
	system("cls");
	printf("Menu:\n1. Insert ke HT\n2. Delete\n3. Display\n4. Exit\n");
	printf("Pilih: "); scanf("%d",&x);
	
	switch(x){
		case 1:{
			printf("Nama yang ingin dimasukkan ke HT: ");
   		 	scanf(" %[^\n]",value);
    		int hashkey= hashKey(value);
    		insert(hashkey, value);
			break;
		}
    	case 2:
    		break;
    	case 3:
    		display(ht);
    		system("pause");
    		break;
    	default:
    		break;
	}
	}while(x!=4);
    
	return 0;
}
