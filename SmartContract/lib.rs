//imports
use anchor_lang::prelude::*;
pub mod constant;
pub mod states;
use crate::{constant::*,states::*};

//use create bring things here but to use it inside main function 
// use usesuper inside clever_todo
declare_id!("4FN4R2fgVS94QqdCYiuzJVNgmAP2qWU3h9oTqMgs2JeH");

#[program]
pub mod clever_todo{
    use super::*;
    
    pub fn initialize_user(
        ctx: Context<InitializeUser>
    ) -> Result<()>{
        //Write Logic Here
        // Initalize user profile with default data
        // Here Initialize User is a struct
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.last_todo = 0;
        user_profile.todo_count = 0;

         Ok(())
    }

    pub fn add_todo(
        ctx:Context<AddTodo>,
        _content : String
    ) -> Result<()>{
        // Fill the todo account with the proper values
        let todo_account = &mut ctx.accounts.todo_account;
        let user_profile = &mut ctx.accounts.user_profile;

        todo_account.authority = ctx.accounts.authority.key();
        todo_account.idx = user_profile.last_todo;
        todo_account.content = _content;
        todo_account.marked = false;

        //Increase todo idx 
        user_profile.last_todo = user_profile.last_todo
        .checked_add(1)
        .unwrap();

        // Increase total todo count 
        user_profile.todo_count = user_profile.todo_count
        .checked_add(1)
        .unwrap();

        Ok(())
    }

    pub fn mark_todo(ctx:Context<MarkTodo> , todo_idx : u8) -> Result<()>{
        let todo_account = &mut ctx.accounts.todo_account;
        //todo_account.marked = !todo_account.marked;
        todo_account.marked = true;

        Ok(())
    }

    pub fn remove_todo(ctx:Context<RemoveTodo>,todo_idx:u8) -> Result<()>{
        //Decrement total todo count
        let user_profile = &mut ctx.accounts.user_profile;

        user_profile.todo_count = user_profile.todo_count
        .checked_sub(1).
        unwrap();
        //No need to decrease the todo idx
        Ok(())
    }
      
}

// defing InitializeUser struct
#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info>{
    // info is a kind of a  life time variable
    #[account(mut)]
    pub authority : Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG,authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8+ std::mem::size_of::<UserProfile>(), 
    )]
    pub user_profile : Box<Account<'info , UserProfile>>,
    pub system_program : Program<'info , System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddTodo<'info>{
    //getting user profile
    #[account(
        mut,
        seeds = [USER_TAG,authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub user_profile : Box<Account<'info,UserProfile>>,

    #[account(
        init,
        seeds = [TODO_TAG , authority.key().as_ref() , &[user_profile.last_todo as u8].as_ref()],
        bump,
        payer = authority,
        space = std::mem::size_of::<TodoAccount>() + 8,
    )]
    pub todo_account : Box<Account<'info , TodoAccount>>,

    #[account(mut)]
    pub authority : Signer<'info>,

    pub system_program : Program<'info,System>,
}

#[derive(Accounts)]
#[instruction(todo_idx : u8)]

pub struct MarkTodo<'info>{
    #[account(
        mut,
        seeds = [USER_TAG,authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile : Box<Account<'info , UserProfile>>,

    #[account(
        mut,
        seeds = [TODO_TAG,authority.key().as_ref(),&[todo_idx].as_ref()],
        bump,
        has_one = authority
    )]
    pub todo_account : Box<Account<'info , TodoAccount>>,

    #[account(mut)]
    pub authority : Signer<'info>,

    pub system_program : Program<'info,System>,
}

#[derive(Accounts)]
#[instruction(todo_idx : u8)]
pub struct RemoveTodo<'info>{
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    
    pub user_profile : Box<Account<'info,UserProfile>>,
    
    #[account(
        mut,
        close = authority,
        seeds = [TODO_TAG,authority.key().as_ref(),&[todo_idx].as_ref()],
        bump,
        has_one = authority,
    )]

    pub todo_account : Box<Account<'info , TodoAccount>>,

    #[account(mut)]

    pub authority : Signer<'info>,

    pub system_program : Program<'info , System>,
    
}