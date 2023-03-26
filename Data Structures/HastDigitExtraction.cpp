#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

struct hastTable{
	char name[100];
	struct hastTable *next;
};
hastTable *ht[26]={NULL};
hastTable *tampung[26];

int hash(char value[])
{
	int hashKey = 0;
	int len, i;
	len = strlen(value);
	for(i=0;i<len;i++){
		hashKey = hashKey + value[i];
	}
	char str[100];
	itoa(hashKey,str,10);
	printf("%s\n",str);
	char str2[100]={NULL};
	if(strlen(str)<=2){
		hashKey=atoi(str);
		if(hashKey>25){
			hashKey=hashKey%26;
			return hashKey;
		}
		else return hashKey;
	}
	else{
		str2[0]=str[strlen(str)-2];
		str2[1]=str[strlen(str)-1];
		printf("%s\n",str2);
		hashKey=atoi(str2);
		if(hashKey>25){
			hashKey=hashKey%26;
			return hashKey;
		}
		else return hashKey;
	}
	
	
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
			printf("Menu:\n1. Insert ke HT\n2. Delete\n3. Display\n4. Exit\n");
	printf("Pilih: "); scanf("%d",&x);
	
	switch(x){
		case 1:{
			printf("Nama yang ingin dimasukkan ke HT: ");
   		 	scanf(" %[^\n]",value);
    		int hashkey= hash(value);
    		insert(hashkey, value);
			break;
		}
    	case 2:
    		break;
    	case 3:
    		display(ht);
    		break;
    	default:
    		break;
	}
	}while(x!=4);
    
	return 0;
}
